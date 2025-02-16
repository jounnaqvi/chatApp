import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";

const Message = ({ message }) => {
  const [authUser] = useAuth();

  useEffect(() => {
    console.log("Auth User:", authUser?.user?._id);
    console.log("Message received in Message.jsx:", message);
  }, [authUser, message]);

  if (!authUser || !authUser.user) {
    return <div>Loading...</div>;
  }

  // ✅ Extract actual message object
  const actualMessage = message?.newMessage || message;

  if (!actualMessage || typeof actualMessage !== "object" || !actualMessage.senderId) {
    console.warn("⚠️ Invalid message structure:", actualMessage);
    return <div>⚠️ No message data available!</div>;
  }

  const isSender = authUser.user._id === actualMessage.senderId;

  // ✅ Extract correct message text
  const messageText =
    actualMessage?.message?.message || // If `message` is nested inside `message`
    actualMessage?.message || // If `message` is directly inside the object
    "⚠️ Message content not available";

  // ✅ Convert timestamp to readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div key={actualMessage._id} className={`p-4 ${isSender ? "chat-end" : "chat-start"}`}>
      <div className={`chat-bubble ${isSender ? "chat-bubble-accent" : ""}`}>
        <p>{messageText}</p>
        <small className="text-gray-400 text-xs block text-right mt-1">
          {formatTime(actualMessage.createdAt)}
        </small>
      </div>
    </div>
  );
};

export default Message;
