// components/LogSign.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // ✅ Use centralized API

const LogSign = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from context
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const res = await api.post(endpoint, formData);

      if (res.data.status) {
        // ✅ Store in context and localStorage
        login(res.data.user, res.data.token);

        Swal.fire({
          icon: "success",
          title: isLogin ? "Login Successful" : "Signup Successful",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#06b6d4",
        });

        const role = res.data.user.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/customer/dashboard");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text:
          error.response?.data?.message || "Something went wrong. Try again.",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-cyan-500 rounded-full blur-xl"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-10 w-16 h-16 bg-blue-500 rounded-full blur-xl"
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-500 rounded-full blur-xl"
          animate={{ y: [-30, 30, -30], x: [-15, 15, -15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </motion.div>

      <motion.div 
        className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated Project Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(6, 182, 212, 0.8)",
                  "0 0 20px rgba(6, 182, 212, 0.6)",
                  "0 0 10px rgba(6, 182, 212, 0.8)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Stock Flow
            </motion.span>
            {' '}
            <motion.span
              className="inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.6)",
                  "0 0 10px rgba(59, 130, 246, 0.8)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              Management
            </motion.span>
            {' '}
            <motion.span
              className="inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(147, 51, 234, 0.8)",
                  "0 0 20px rgba(147, 51, 234, 0.6)",
                  "0 0 10px rgba(147, 51, 234, 0.8)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              System
            </motion.span>
          </motion.h1>
          
          <motion.div
            className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 1 }}
          />
          
          <motion.p 
            className="text-gray-300 mt-3 text-lg font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Professional Inventory Management Solution
          </motion.p>
        </motion.div>

        <motion.h2 
          className="text-2xl font-bold text-white text-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {isLogin ? "Welcome Back" : "Join Our Platform"}
        </motion.h2>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700/80 backdrop-blur-sm text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 placeholder-gray-400"
              />
            </motion.div>
          )}
          
          <motion.input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700/80 backdrop-blur-sm text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 placeholder-gray-400"
            whileFocus={{ scale: 1.02 }}
          />
          
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700/80 backdrop-blur-sm text-white rounded-lg border border-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 placeholder-gray-400"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? "Sign In to Your Account" : "Create Your Account"}
            </motion.span>
          </motion.button>
        </motion.form>

        <motion.p
          onClick={toggleMode}
          className="mt-6 text-center text-gray-400 cursor-pointer hover:text-cyan-400 transition-all duration-300 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          whileHover={{ scale: 1.05, color: "#06b6d4" }}
          whileTap={{ scale: 0.95 }}
        >
          {isLogin
            ? "New to our platform? Create your account"
            : "Already have an account? Sign in here"}
        </motion.p>
        
        {/* Decorative Elements */}
        <motion.div 
          className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full opacity-60"
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full opacity-60"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>
    </div>
  );
};

export default LogSign;
