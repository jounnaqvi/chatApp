import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import useConversation from "../statemanage/useConversation.js";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket) {
      console.warn("🚨 No socket connection!");
      return;
    }

    const handleNewMessage = (newMessage) => {
      console.log("📩 New message received:", newMessage);

      if (!selectedConversation) return; // Prevents crash

      // ✅ Check if the message belongs to the selected conversation
      if (
        newMessage.senderId === selectedConversation._id ||
        newMessage.receiverId === selectedConversation._id
      ) {
        console.log("🆕 Adding new message to state:", newMessage);

        setMessages((prevMessages) => {
          // ✅ Prevent duplicate messages
          const exists = prevMessages.some((msg) => msg._id === newMessage._id);
          if (!exists) {
            return [...prevMessages, newMessage];
          }
          return prevMessages;
        });
      }
    };

    // ✅ Ensure listener remains active
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, setMessages]); // ✅ Ensure dependencies update correctly

  return { messages };
};

export default useGetSocketMessage;
