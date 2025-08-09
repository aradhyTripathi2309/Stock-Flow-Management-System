import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminWelcomeScreen = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Categories",
      description: "Manage your product categories",
      
      path: "/admin/dashboard/categories",
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:shadow-blue-500/25"
    },
    {
      title: "Products",
      description: "Full product lifecycle management",
      path: "/admin/dashboard/products",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:shadow-green-500/25"
    },
    {
      title: "Orders",
      description: "Process and track all your orders",
     
      path: "/admin/dashboard/orders",
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:shadow-purple-500/25"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[80vh] text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-white max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to Stock Flow Management System
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Your Professional Inventory Management Solution
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              className={`bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${action.hoverColor} group`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              onClick={() => handleCardClick(action.path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {action.icon}
              </motion.div>
              
              <h3 className="text-xl font-semibold mb-3 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                {action.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {action.description}
              </p>
              
              <div className={`mt-4 px-4 py-2 bg-gradient-to-r ${action.color} rounded-lg text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                Click to manage →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminWelcomeScreen;
