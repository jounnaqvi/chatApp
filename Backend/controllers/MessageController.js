import Conversation from "../models/ConversationModel.js";
import Message from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../SocketIo/server.js";

// Send message
// Backend message sending
export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    // Create a new message
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
    }

    await conversation.save();

    console.log("Message sent to:", receiverId, message);

    // Send real-time update via Socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        message: newMessage.message,
      });
    }

    res.status(200).json({ success: true, message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




// Get messages
export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
