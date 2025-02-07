// components/Right.jsx
import React from "react";
import ChatUser from "./ChatUser";
import Messages from "./Messages";
import Type from "./Type";
import useConversation from "../../statemanage/useConversation";

export const Right = () => {
  const { selectedConversation } = useConversation();

  return (
    <div className="w-full bg-slate-700 text-white">
      {!selectedConversation ? (
        <Nochat />
      ) : (
        <>
          <ChatUser />
          <div
            className="flex-jaun overflow-y-auto"
            style={{ maxHeight: "calc(92vh - 14vh)" }}
          >
            <Messages />
          </div>
          <Type />
        </>
      )}
    </div>
  );
};

const Nochat = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-center text-xl">
        No conversation selected
        <br />
        Select a conversation to start a chat.
      </h1>
    </div>
  );
};

export default Right;
