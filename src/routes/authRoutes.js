const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  fetchPendingManufacturers,
  authorizeManufacturer,
  declineManufacturer,
  updatePassword,
  approveManufacturer
} = require("../controllers/authController");
const supabase = require('../config/supabaseClient');  
router.post("/register", register);
router.post("/login", loginUser)
router.get("/pending-manufacturers", fetchPendingManufacturers);
router.post("/authorize", authorizeManufacturer);
router.post("/decline-manufacturer", declineManufacturer);
router.put("/update-password", updatePassword);
router.post("/approveMf",approveManufacturer)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No authorization header' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    return res.json(data.user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
