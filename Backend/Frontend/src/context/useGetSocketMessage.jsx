import { useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../statemanage/useConversation.js";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("⚡ Checking Socket Connection:", socket);

    if (!socket) {
      console.warn("🚨 No socket connection!");
      return;
    }

    const handleNewMessage = (newMessage) => {
      console.log("📩 New message received:", newMessage);

      if (selectedConversation && newMessage.senderId === selectedConversation._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoading(false); // ✅ Fix: Set loading to false when message is received
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, selectedConversation]);

  // ✅ Fix: If messages exist, loading should be false
  useEffect(() => {
    if (messages.length > 0) {
      setLoading(false);
    }
  }, [messages]);

  console.log("💾 Messages state:", messages);
  console.log("⏳ Loading state:", loading);

  return { messages, loading };
};

export default useGetSocketMessage;
