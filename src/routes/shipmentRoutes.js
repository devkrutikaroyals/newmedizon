const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment'); // Ensure this line is correct
const authenticate = require("../middleware/authMiddleware");

// Add Shipment
router.post('/', authenticate, async (req, res) => {
  try {
    const shipmentData = {
      orderId: req.body.orderId,
      trackingNumber: req.body.trackingNumber,
      status: req.body.status,
    };

    const shipment = new Shipment(shipmentData);
    await shipment.save();
    res.status(201).json(shipment);
  } catch (error) {
    console.error("Error saving shipment:", error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch Shipments
router.get('/', authenticate, async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update Shipment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedData = {
      orderId: req.body.orderId,
      trackingNumber: req.body.trackingNumber,
      status: req.body.status,
    };

    const updatedShipment = await Shipment.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.json(updatedShipment);
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(400).json({ message: error.message });
  }
});

// Delete Shipment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!deletedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;