import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import { app, server } from "./SocketIo/server.js"; 
import express from "express";
import path from "path";

dotenv.config(); // Load environment variables
console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging

app.use(cookieParser());

// CORS Setup
const corsOptions = {
  origin: ["http://localhost:4001", "http://localhost:4002"], // Allowed frontend domains
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Call the function to connect to MongoDB
connectDB();

// Routes
app.use("/user", UserRoute);
app.use("/message", MessageRoute);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./Frontend/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "./Frontend/dist", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
