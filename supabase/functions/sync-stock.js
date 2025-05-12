// sync-stock.js
const { createClient } = require('@supabase/supabase-js');
const { MongoClient, ObjectId } = require('mongodb');

// Cache MongoDB connection
let mongoClient;
let isMongoConnected = false;

module.exports = async (req, res) => {
  // Validate request method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
      console.warn('Unauthorized sync attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      { 
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } } 
      }
    );

    // Connect to MongoDB (with connection pooling)
    if (!isMongoConnected) {
      mongoClient = new MongoClient(process.env.MONGO_URI, {
        connectTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        retryWrites: true,
        retryReads: true
      });
      await mongoClient.connect();
      isMongoConnected = true;
      console.log('MongoDB connection established');
    }

    const db = mongoClient.db("admin-panel");
    const productsCollection = db.collection("products");
    const syncLogsCollection = db.collection("sync_logs");

    // Get pending syncs with pagination
    const { data: changedProducts, error } = await supabase
      .from('product_stock_changes')
      .select('*')
      .eq('synced', false)
      .limit(100); // Prevent overloading

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!changedProducts || changedProducts.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No pending syncs found',
        synced: 0 
      });
    }

    const syncResults = {
      total: changedProducts.length,
      succeeded: 0,
      failed: 0,
      failures: []
    };

    // Process changes in transaction
    const session = mongoClient.startSession();
    try {
      await session.withTransaction(async () => {
        for (const product of changedProducts) {
          try {
            // Convert ID format based on your MongoDB schema
            const productId = product.product_id.length === 24 ? 
              new ObjectId(product.product_id) : 
              product.product_id;

            // Update MongoDB stock
            const updateResult = await productsCollection.updateOne(
              { _id: productId },
              { $inc: { stock: -product.quantity_changed } },
              { session }
            );

            if (updateResult.modifiedCount === 1) {
              // Mark as synced in PostgreSQL
              const { error: updateError } = await supabase
                .from('product_stock_changes')
                .update({ 
                  synced: true, 
                  synced_at: new Date().toISOString(),
                  last_sync_status: 'success'
                })
                .eq('id', product.id);

              if (updateError) throw updateError;

              syncResults.succeeded++;
            } else {
              throw new Error('Product not found in MongoDB');
            }
          } catch (err) {
            syncResults.failed++;
            syncResults.failures.push({
              product_id: product.product_id,
              error: err.message
            });

            // Log failed sync
            await supabase
              .from('product_stock_changes')
              .update({ 
                last_sync_status: 'failed',
                last_error: err.message,
                retry_count: (product.retry_count || 0) + 1
              })
              .eq('id', product.id);

            console.error(`Sync failed for product ${product.product_id}:`, err);
          }
        }
      });
    } finally {
      await session.endSession();
    }

    // Log sync results
    await syncLogsCollection.insertOne({
      timestamp: new Date(),
      ...syncResults,
      duration_ms: Date.now() - req.startTime
    });

    return res.json({
      success: true,
      ...syncResults,
      message: `Synced ${syncResults.succeeded} of ${syncResults.total} products`
    });

  } catch (err) {
    console.error('SYNC PROCESS FAILED:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  if (mongoClient) {
    await mongoClient.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});