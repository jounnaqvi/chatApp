import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider"; // Correct Path

import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext";

import Left from "./home/left/Left";
import Right from "./home/right/Right";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Logout from "./home/left1/Logout1";

function App() {
  const [authUser,setAuthUser] = useAuth(); // Correctly using AuthContext

  console.log("authUser", authUser);

  return (
    <SocketProvider>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="flex h-screen">
                <Logout />
                <Left />
                <Right />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Toaster />
    </SocketProvider>
  );
}

export default App;
