import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    switch (user.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "customer":
        navigate("/customer/dashboard");
        break;
      default:
        navigate("/login"); // fallback
    }
  }, [user, navigate]);

  return null;
};

export default Root;
