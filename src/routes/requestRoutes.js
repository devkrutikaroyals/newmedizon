const express = require("express");
const { getRequests, createRequest } = require("../controllers/requestController");
const router = express.Router();

router.get("/", getRequests);
router.post("/", createRequest);

module.exports = router;