import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: ["https://chatapp-pice.onrender.com"], 
    methods: ["GET", "POST"],
  },
});

const users = {}; // Stores online users

export const getReceiverSocketId = (receiverId) => users[receiverId];

io.on("connection", (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  // Store userId from handshake authentication
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log(`📌 User ${userId} connected with socket ID: ${socket.id}`);
    io.emit("onlineUsers", Object.keys(users)); // Notify all clients
  }

  // ✅ Listen for "sendMessage" event
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log(`📩 Message from ${senderId} to ${receiverId}:`, message);

    const newMessage = { senderId, receiverId, message };

    // ✅ Send message back to sender
    io.to(users[senderId]).emit("newMessage", newMessage);

    // ✅ Send message to receiver if online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("🚫 Receiver is offline. Message stored in DB.");
    }
  });

  // ✅ Handle user disconnecting
  socket.on("disconnect", () => {
    for (const id in users) {
      if (users[id] === socket.id) {
        console.log(`🔴 User ${id} disconnected`);
        delete users[id];
        break;
      }
    }
    io.emit("onlineUsers", Object.keys(users)); // Notify all clients
  });
});

// 🔴 REMOVE server.listen() from here! 
export { app, io, server };
