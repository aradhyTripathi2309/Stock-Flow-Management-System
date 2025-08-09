import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const { user } = useAuth();

  useEffect(() => {
    console.log("🛡️ Protected Route Check:");
    console.log("User:", user);
    console.log("Required Role(s):", requiredRole);
  }, [user]);

  // 🔒 If user is not logged in
  if (!user) {
    console.warn("🔐 No user logged in. Redirecting to /login");
    return <Navigate to="/login" />;
  }

  // 🚫 If role doesn't match
  if (!requiredRole.includes(user.role)) {
    console.warn(`🚫 User role "${user.role}" not authorized`);
    return <Navigate to="/unauthorized" />;
  }

  // ✅ Authorized
  return children;
};

export default ProtectedRoutes;
