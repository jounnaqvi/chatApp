import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";

const SocketContext = createContext();
export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    if (authUser && authUser.user?._id) {
      const newSocket = io("https://chatapp-pice.onrender.com", {
        auth: { userId: authUser.user._id }, // ✅ Send userId in `auth`
        transports: ["websocket"], // 🔧 Ensures real-time stability
      });

      newSocket.on("connect", () => {
        console.log("✅ Connected to WebSocket:", newSocket.id);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ WebSocket Connection Error:", err.message);
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("🔌 Disconnected:", reason);
      });

      newSocket.on("onlineUsers", (users) => {
        console.log("👥 Online Users:", users);
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        console.log("🔌 Socket Disconnected");
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
