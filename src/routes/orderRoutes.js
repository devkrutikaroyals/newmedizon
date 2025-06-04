// const express = require('express');
// const router = express.Router();
// const supabase = require("../config/supabaseClient");

// router.get('/manufacturer/:id', async (req, res) => {
//   const manufacturerId = req.params.id;
//   console.log("🔍 Filtering for manufacturer ID:", manufacturerId);

//   try {
//     const { data, error } = await supabase
//       .from('product_order')
//       .select('*');

//     if (error) throw error;

//     // ✅ Parse items before filtering
//     const filteredOrders = data.filter(order => {
//       try {
//         const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
//         return items.some(item => item.manufacturer === manufacturerId);
//       } catch (err) {
//         console.error("❌ Error parsing items for order:", order.id, err.message);
//         return false;
//       }
//     });

//     res.status(200).json(filteredOrders);
//   } catch (error) {
//     console.error('❌ Error fetching manufacturer orders:', error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
