const express = require("express");
const { getCompanies, createCompany } = require("../controllers/companyController");
const Company = require("../models/Company"); // Import the Company model
const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);

// Get total companies count
router.get("/total-companies", async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();
    res.json({ totalCompanies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching company count", error });
  }
});

module.exports = router;
