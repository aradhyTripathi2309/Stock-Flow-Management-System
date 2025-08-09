import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pos-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Token is automatically handled by the api utility
  useEffect(() => {
    // The api utility automatically handles token from localStorage
    // No need to manually set axios headers here
    console.log("User state updated:", user);
  }, [user]);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("pos-user", JSON.stringify(userData));
    localStorage.setItem("pos-token", token);
    console.log("✅ User saved to context:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pos-user");
    localStorage.removeItem("pos-token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for accessing context easily
export const useAuth = () => useContext(AuthContext);

// Export the context for direct access
export { AuthContext };

export default AuthProvider;
