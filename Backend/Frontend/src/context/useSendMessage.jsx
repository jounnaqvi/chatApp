import { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import { useSocketContext } from "../context/SocketContext";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setMessages, addMessage, selectedConversation } = useConversation();
  const { socket } = useSocketContext(); 

  const sendMessages = async (message) => {
    if (!selectedConversation?._id) {
      console.warn("⚠️ No conversation selected.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("❌ No token found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `http://localhost:5002/message/send/${selectedConversation._id}`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.newMessage) {
        console.log("📩 Message sent successfully:", res.data.newMessage);
        addMessage(res.data.newMessage); 

        if (!socket || !socket.connected) {
          console.warn("⚠️ Socket not ready. Retrying in 2s...");
          setTimeout(() => {
            if (socket && socket.connected) {
              socket.emit("sendMessage", {
                senderId: res.data.newMessage.senderId,
                receiverId: selectedConversation._id,
                message: res.data.newMessage,
              });
              console.log("📡 Message sent after reconnection.");
            } else {
              console.error("❌ Socket still not connected.");
            }
          }, 2000);
        } else {
          console.log("📡 Emitting message via socket...");
          socket.emit("sendMessage", {
            senderId: res.data.newMessage.senderId,
            receiverId: selectedConversation._id,
            message: res.data.newMessage,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
