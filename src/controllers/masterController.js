const Master = require("../models/Master");

// Get all masters
exports.getMasters = async (req, res) => {
  try {
    const masters = await Master.find();
    res.json(masters);
  } catch (error) {
    res.status(500).json({ message: "Error fetching masters", error });
  }
};

// Create master
exports.createMaster = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newMaster = new Master({ name, email, password });
    await newMaster.save();
    res.status(201).json(newMaster);
  } catch (error) {
    res.status(500).json({ message: "Error creating master", error });
  }
};
