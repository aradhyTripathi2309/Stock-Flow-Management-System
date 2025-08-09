import React from "react";
import { Outlet } from "react-router-dom"; // use react-router-dom
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16 p-4 md:ml-64 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen transition-all duration-500">
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 animate-fade-in-down tracking-wide">
            Welcome,{" "}
            <span className="text-white">{user ? user.name : "Guest"}</span>
          </h1>
          <Outlet /> {/* Only works if child routes are defined */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
