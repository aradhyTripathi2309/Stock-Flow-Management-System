// App.jsx - Stock Flow Management System
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// Admin Components
import Categories from "./components/Categories.jsx";
import Suppliers from "./components/Suppliers.jsx";
import Products from "./components/Products.jsx";
import Users from "./components/Users.jsx";
import RetailerOrder from "./components/RetailerOrder.jsx";
import AdminOrders from "./components/AdminOrders.jsx";
import CustomerPlaceOrder from "./components/CustomerPlaceOrder.jsx";

// Customer Components
import CustomerProducts from "./components/CustomerProducts.jsx";
import Profile from "./components/Profile.jsx";

// Welcome Screen
import AdminWelcomeScreen from "./components/AdminWelcomeScreen.jsx";

// Auth Component
import LogSign from "./components/LogSign.jsx";

function App() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LogSign />} />

          {/* Unauthorized Access */}
          <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoutes requiredRole={["admin"]}>
                <Dashboard />
              </ProtectedRoutes>
            }
          >
          <Route
            index
            element={<AdminWelcomeScreen />}
          />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<AdminOrders />} />{" "}
            {/* Admin view */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Customer Dashboard Routes */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoutes requiredRole={["customer"]}>
                <Dashboard />
              </ProtectedRoutes>
            }
          >
            <Route index element={<CustomerProducts />} />
            <Route path="place-order" element={<CustomerPlaceOrder />} />{" "}
            {/* Customer place order */}
            <Route path="orders" element={<RetailerOrder />} />{" "}
            {/* Customer view orders */}
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback Route for 404 */}
          <Route
            path="*"
            element={
              <motion.div 
                className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center text-white">
                  <motion.div 
                    className="text-6xl mb-6"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    404
                  </motion.div>
                  <motion.h1 
                    className="text-4xl font-bold mb-4 text-cyan-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    404 - Page Not Found
                  </motion.h1>
                  <motion.p 
                    className="text-gray-400 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    The page you're looking for doesn't exist.
                  </motion.p>
                  <motion.button 
                    className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    onClick={() => window.history.back()}
                  >
                    ← Go Back
                  </motion.button>
                </div>
              </motion.div>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
