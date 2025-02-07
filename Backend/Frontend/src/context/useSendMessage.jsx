import React, { useState } from "react";
import useConversation from "../statemanage/useConversation.js";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessages = async (message) => {
    setLoading(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem("jwt");
      
      // If token is not available, you can handle accordingly (like showing a message or redirecting to login)
      if (!token) {
        console.error("No token found. Please log in again.");
        setLoading(false);
        return;
      }

      // Send the message with the token in the Authorization header
      const res = await axios.post(
        `http://localhost:5002/message/send/${selectedConversation._id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );

      // Update messages with the new one
      setMessages([...messages, res.data]);

      setLoading(false);
    } catch (error) {
      console.log("Error in send messages", error);
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;
