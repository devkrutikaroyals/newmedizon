const Product = require('../models/Product');
const Order = require('../models/Order');

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ msg: 'Insufficient stock' });
    }

    // Create Order
    const newOrder = new Order({
      product: productId,
      quantity,
      status: 'confirmed',
    });
    await newOrder.save();

    // Update Stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({ msg: 'Order placed', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order || order.status === 'cancelled') {
      return res.status(400).json({ msg: 'Order not found or already cancelled' });
    }

    // Update stock
    const product = await Product.findById(order.product);
    product.stock += order.quantity;
    await product.save();

    // Update order status
    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ msg: 'Order cancelled and stock restored' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
