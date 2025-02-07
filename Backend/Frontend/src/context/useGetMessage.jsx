import { useEffect, useState } from "react";
import axios from "axios";
import { useSocketContext } from "./SocketContext"; // Import socket context
import useConversation from "../statemanage/useConversation";

const useGetMessage = () => {
  const { messages, setMessages, addMessage, selectedConversation } = useConversation();
  const [loading, setLoading] = useState(false);
  const { socket } = useSocketContext(); // Get socket instance

  useEffect(() => {
    if (!selectedConversation?._id) {
      console.warn("No conversation selected.");
      return;
    }

    const getMessages = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("No token found. User is unauthorized.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5002/message/get/${selectedConversation._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && response.data.messages) {
          console.log("📨 Messages loaded:", response.data.messages);
          setMessages(response.data.messages);
        } else {
          console.warn("Unexpected API response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages]);

  // ✅ Listen for new messages via Socket.io
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log("📩 New Message Received:", newMessage);

      if (!newMessage || !newMessage.senderId) {
        console.warn("⚠️ Invalid message format:", newMessage);
        return;
      }

      addMessage(newMessage); // ✅ Use addMessage instead of setMessages
    };

    if (socket) {
      socket.on("newMessage", handleNewMessage);
    }

    return () => {
      if (socket) {
        socket.off("newMessage", handleNewMessage);
      }
    };
  }, [socket, addMessage]);

  return { loading, messages };
};

export default useGetMessage;
