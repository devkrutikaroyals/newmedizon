const Item = require("../models/Item"); // Ensure you have an Item model

// Add Item
const addItem = async (req, res) => {
    try {
        const newItem = new Item({ ...req.body, userId: req.user.id });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Item
const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Item
const deleteItem = async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch Items
const getItems = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addItem, updateItem, deleteItem, getItems };