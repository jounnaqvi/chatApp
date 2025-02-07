import React from "react";
// import Left from "./home/Leftpart/Left";
import Left from "./home/left/Left"
// import Right from "./home/Rightpart/Right";
import Right  from "./home/right/Right"
import SignUp from "./components/Signup.jsx";

import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";
import Logout from "./home/left1/Logout1";

import { Navigate, Route, Routes } from "react-router-dom";

// import { logout } from "../../Backend/controllers/UserController";
function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log("authUser",authUser);
  return (
    <>
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
              <Navigate to={"/login"} />
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
      {/* <Loading/> */}
    </>
  );
}

export default App;

