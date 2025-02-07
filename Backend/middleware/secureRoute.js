import jwt from "jsonwebtoken";
import User from "../models/UserModels.js";

const secureRoute = async (req, res, next) => {
  try {
    // Extract token from Cookie or Authorization Header
    const token =
      req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    console.log("🔑 Received Token:", token);

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📜 Decoded Token:", decoded);

    // Fetch user with the correct field
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "No user found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("⚠️ Error in secureRoute:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export default secureRoute;