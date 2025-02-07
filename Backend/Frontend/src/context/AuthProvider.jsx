import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';  // Import Cookies library

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // First, check if there's a token in localStorage
    const storedToken = localStorage.getItem("jwt");
    const storedUser = localStorage.getItem("user");

    // If localStorage has the token and user, use them
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthUser({
          user: parsedUser,
          token: storedToken,
        });
      } catch (error) {
        console.error("Error parsing authUser from localStorage:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    }

    // Check if there's a token in cookies as fallback
    const cookieToken = Cookies.get("jwt");
    const cookieUser = Cookies.get("user");

    // If there's a token in cookies and no localStorage data, use cookies
    if (cookieToken && cookieUser) {
      try {
        const parsedUser = JSON.parse(cookieUser);
        setAuthUser({
          user: parsedUser,
          token: cookieToken,
        });
      } catch (error) {
        console.error("Error parsing authUser from Cookies:", error);
        Cookies.remove("jwt");
        Cookies.remove("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};
