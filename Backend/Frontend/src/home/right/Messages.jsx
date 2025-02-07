import React, { useEffect, useRef, useState } from "react";
import useGetMessage from "../../context/useGetMessage";
import Message from "./Message"; // Import Message component
import useGetSocketMessage from "../../context/useGetSocketMessage";

const Messages = () => {
  const { messages, loading } = useGetMessage();
  const messagesEndRef = useRef(null); // Reference to scroll to the end
  const [uniqueMessages, setUniqueMessages] = useState([]);
  useGetSocketMessage();
  console.log(messages);

  // ✅ Ensure messages are unique
  useEffect(() => {
    if (Array.isArray(messages)) {
      const filteredMessages = messages.reduce((acc, msg) => {
        if (!acc.some((m) => m._id === msg._id)) {
          acc.push(msg);
        }
        return acc;
      }, []);

      setUniqueMessages(filteredMessages);
    }
  }, [messages]);

  // ✅ Scroll to bottom when new messages arrive
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
      {/* Scroll to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
