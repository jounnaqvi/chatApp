import React, { useEffect, useRef, useState } from "react";
import useGetMessage from "../../context/useGetMessage";
import useGetSocketMessage from "../../context/useGetSocketMessage";
import Message from "./Message";
import { useSocketContext } from "../../context/SocketContext"; // Import socket context

const Messages = () => {
  const { messages, loading } = useGetMessage(); // Fetch initial messages
  const { socket } = useSocketContext(); // Get socket from context
  const messagesEndRef = useRef(null); // Ref for auto-scrolling
  const [uniqueMessages, setUniqueMessages] = useState([]);

  useGetSocketMessage(); // Listen for incoming messages

  // ✅ Ensure messages are unique & updated
  useEffect(() => {
    if (Array.isArray(messages)) {
      setUniqueMessages((prevMessages) => {
        const newMessages = messages.filter(
          (newMsg) => !prevMessages.some((msg) => msg._id === newMsg._id)
        );
        return [...prevMessages, ...newMessages];
      });
    }
  }, [messages]);

  // ✅ Listen for real-time messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("📩 New real-time message received:", newMessage);
      
      if (!newMessage || typeof newMessage !== "object" || !newMessage._id) {
        console.warn("⚠️ Invalid message structure:", newMessage);
        return;
      }

      setUniqueMessages((prevMessages) => {
        const exists = prevMessages.some((msg) => msg._id === newMessage._id);
        return exists ? prevMessages : [...prevMessages, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket]);

  // ✅ Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [uniqueMessages]);

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-[80vh]">
      {uniqueMessages.length > 0 ? (
        uniqueMessages.map((message, index) => (
          <Message key={`${message._id}-${index}`} message={message} />
        ))
      ) : (
        <p className="text-center">No messages found.</p>
      )}
      {/* Auto-scroll reference */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
