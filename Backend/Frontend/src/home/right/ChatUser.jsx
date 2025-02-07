import React from 'react';
import useConversation from "../../statemanage/useConversation";
import { useSocketContext } from '../../context/SocketContext';

function ChatUser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  // Function to check if user is online
  const getOnlineUseStatus = (userId) => {
    if (!userId) return "offline"; // Prevent errors if userId is undefined
    return onlineUsers.includes(userId) ? "online" : "offline";
  };

  if (!selectedConversation) {
    return <div className="p-5 text-white">⚠️ No conversation selected</div>;
  }

  return (
    <div className="pl-5 pt-5 pb-3 h-[14vh] flex space-x-4 bg-gray-900 hover:bg-gray-600 duration-300">
      {/* Avatar */}
      <div>
        <div className={`avatar ${getOnlineUseStatus(selectedConversation._id) === "online" ? "online" : ""}`}>
          <div className="w-14 rounded-full">
            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User" />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div>
        <h1 className="text-xl text-white">{selectedConversation.name}</h1>
        <span className="text-sm p-3 text-gray-300">
          {getOnlineUseStatus(selectedConversation._id)}
        </span>
      </div>
    </div>
  );
}

export default ChatUser;
