const jwt = require("jsonwebtoken");

// Replace with an actual token from your localStorage or API request
const token = "your_actual_token_here"; 

// Replace with your actual JWT_SECRET from .env file
const secretKey = "your_secret_key"; 

try {
    const decoded = jwt.verify(token, secretKey);
    console.log("✅ Token is valid:", decoded);
} catch (error) {
    console.error("❌ Invalid token error:", error.message);
}
