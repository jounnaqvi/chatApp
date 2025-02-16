import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    console.log("LocalStorage Token:", storedToken);
    console.log("LocalStorage User:", storedUser);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthUser({
          user: parsedUser,
          token: storedToken,
        });
        console.log("AuthUser set from LocalStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing authUser from localStorage:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    } else {
      // Fallback to cookies
      const cookieToken = Cookies.get("jwt");
      const cookieUser = Cookies.get("user");

      console.log("Cookie Token:", cookieToken);
      console.log("Cookie User:", cookieUser);

      if (cookieToken && cookieUser) {
        try {
          const parsedUser = JSON.parse(cookieUser);
          setAuthUser({
            user: parsedUser,
            token: cookieToken,
          });
          console.log("AuthUser set from Cookies:", parsedUser);
        } catch (error) {
          console.error("Error parsing authUser from Cookies:", error);
          Cookies.remove("jwt");
          Cookies.remove("user");
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};
