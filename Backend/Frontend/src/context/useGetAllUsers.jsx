import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthProvider";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authUser] = useAuth(); // Get token from AuthContext

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);

      let token = authUser?.token || Cookies.get("jwt") || localStorage.getItem("jwt");

      if (!token) {
        console.error("❌ No token found. User is unauthorized.");
        setLoading(false);
        return;
      }

      console.log("🔑 Sending token:", token);

      try {
        const response = await axios.get("http://localhost:5002/user/allusers", {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
          withCredentials: true,
        });

        console.log("✅ Users received:", response.data);
        setAllUsers(response.data);
      } catch (error) {
        console.error("❌ API error:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          console.error("🔑 Token might be invalid or expired");
        }
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.token) {
      getUsers();
    }
  }, [authUser]);

  return [allUsers, loading];
}

export default useGetAllUsers;
