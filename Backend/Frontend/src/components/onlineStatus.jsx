import React from "react";

const OnlineStatus = ({ isOnline }) => {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
      title={isOnline ? "Online" : "Offline"}
    ></span>
  );
};

export default OnlineStatus;
