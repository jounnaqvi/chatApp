import React from "react";
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../statemanage/useConversation";
import { useSocketContext } from "../../context/SocketContext"; // Import the socket context

const User = () => {
  const [allUsers, loading, error] = useGetAllUsers();
  const { setSelectedConversation, selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading users: {error.message}</p>
      </div>
    );
  }

  if (!allUsers || allUsers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No users available</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {allUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id);
        return (
          <div
            key={user._id}
            className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition duration-300 ${
              selectedConversation?._id === user._id ? "bg-gray-700" : "hover:bg-gray-600"
            }`}
            onClick={() => setSelectedConversation(user)}
          >
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full"
                src={
                  user.avatar ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
                alt={`Avatar of ${user.name || "Unknown User"}`}
                loading="lazy"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-white">{user.name || "Unknown User"}</h1>
              <span className="text-gray-400">{user.email || "No Email Provided"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default User;
