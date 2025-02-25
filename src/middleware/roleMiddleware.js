const jwt = require("jsonwebtoken");

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = roleMiddleware;
 