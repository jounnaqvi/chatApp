import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRoute from "./routes/UserRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import { app, server } from "./SocketIo/server.js"; 
import express from "express";
import path from 'path';
import { dir } from "console";
// Ensure this is correctly exporting app

dotenv.config();

app.use(cookieParser());

// CORS Setup
const corsOptions = {
  origin: ["http://localhost:4001", "http://localhost:4002"], // Allow frontend domains
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use("/user", UserRoute);
app.use("/message", MessageRoute);


if(process.env.NODE_ENV==='production'){
 const dirPath = path.resolve();
 app.use(express.static("./Frontend/dist"));
 app.get("*",(req,res)=>{
   res.sendFile(path.join(dirPath,"./Frontend/dist","index.html"));

 })

}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 