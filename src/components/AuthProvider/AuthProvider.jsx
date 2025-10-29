import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import React from "react";
import { AuthContext } from "./AuthContext";

const iAuthService = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "demo@example.com" && password === "zab#723") {
        resolve({ token: "auth-user", email: email, password: password });
      } else {
        reject("Invalid email or password");
      }
    }, 3000);
  });
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      // Simulate a call to an authentication service
      const response = await iAuthService(email, password); // Replace with your auth service
      if (response.token) {
        const stringify = {
          token: response.token,
          email: response.email,
          password: response.password,
        };
        const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        setCookie("auth-user", authUserSr, 1);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    eraseCookie("auth-user");
    setIsAuthenticated(false);
  };

  React.useEffect(() => {
    let authUserSr = getCookie("auth-user");
    if (authUserSr) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
