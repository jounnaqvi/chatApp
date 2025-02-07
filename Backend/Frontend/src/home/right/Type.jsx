import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import useSendMessage from "../../context/useSendMessage";

const Type = () => {
  const { loading, sendMessages } = useSendMessage();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!message.trim()) return; // Prevent sending empty messages

    await sendMessages(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex">
      <div className="flex w-[80%] space-x-2 h-[8vh] items-center bg-slate-900 p-2 rounded">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type here..."
          className="flex-grow input border border-gray-600 outline-none input-bordered bg-transparent text-white px-3"
        />
        <button 
          type="submit" 
          className="text-3xl text-white" 
          disabled={loading || !message.trim()}  // Disable button if loading or empty message
        >
          <IoMdSend />
        </button>
      </div>
    </form>
  );
};

export default Type;
