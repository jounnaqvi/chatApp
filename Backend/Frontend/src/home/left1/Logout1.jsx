import React, { useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import axios from "axios";
import Cookie from "js-cookie";

const Logout1 = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Send request to backend to clear refresh token and JWT
      await axios.post("http://localhost:5002/user/logout", {}, { withCredentials: true });

      // Clear JWT from localStorage and cookie
      localStorage.removeItem("jwt");
      Cookie.remove("jwt");

      setLoading(false);
      alert("Logged out successfully");

      // Redirect to login page
      window.location.href = "/login"; // Or use navigate("/login") with React Router

    } catch (error) {
      setLoading(false); // Stop loading in case of an error
      console.log(error);
    }
  };

  return (
    <div className="w-[4%] bg-slate-950 text-white flex flex-col justify-end">
      <div className="p-3 align-bottom">
        <form action="">
          <div className="flex space-x-3">
            <RiLogoutBoxLine
              className="text-5xl p-2 hover:bg-gray-600 rounded-full duration-300"
              onClick={handleLogout} // Only this onClick is needed
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Logout1;
