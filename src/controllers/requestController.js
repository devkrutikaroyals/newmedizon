// requestController.js
const Request = require("../models/Request");

// Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
