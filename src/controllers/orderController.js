const Product = require('../models/Product');
const Order = require('../models/Order');

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { product, quantity, manufacturer } = req.body;

    // Validate input
    if (!product || !quantity || !manufacturer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check product availability
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productDoc.stock < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Only ${productDoc.stock} available`
      });
    }

    // Create order
    const order = new Order({
      product,
      quantity,
      manufacturer,
      status: 'Confirmed'
    });

    // Update product stock (using transaction for safety)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await order.save({ session });
      
      productDoc.stock -= quantity;
      await productDoc.save({ session });
      
      await session.commitTransaction();
      
      res.status(201).json({
        message: 'Order placed successfully',
        order
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ 
      message: 'Failed to place order',
      error: error.message 
    });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if already cancelled
    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order already cancelled' });
    }

    // Check if order can be cancelled (only Pending or Confirmed)
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Update order and restore stock (using transaction)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Restore product stock
      const product = await Product.findById(order.product).session(session);
      product.stock += order.quantity;
      await product.save();

      // Update order status
      order.status = 'Cancelled';
      await order.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        message: 'Order cancelled successfully',
        order
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ 
      message: 'Failed to cancel order',
      error: error.message 
    });
  }
};