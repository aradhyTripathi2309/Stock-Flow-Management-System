import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaHome,
  FaTable,
  FaBox,
  FaTruck,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [menuLinks, setMenuLinks] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      setMenuLinks([
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: <FaHome />,
          isParent: true,
        },
        {
          name: "Categories",
          path: "/admin/dashboard/categories",
          icon: <FaTable />,
        },
        {
          name: "Products",
          path: "/admin/dashboard/products",
          icon: <FaBox />,
        },
        {
          name: "Suppliers",
          path: "/admin/dashboard/suppliers",
          icon: <FaTruck />,
        },
        {
          name: "Orders",
          path: "/admin/dashboard/orders",
          icon: <FaShoppingCart />,
        },
        { name: "Users", path: "/admin/dashboard/users", icon: <FaUsers /> },
        { name: "Profile", path: "/admin/dashboard/profile", icon: <FaCog /> },
        {
          name: "Logout",
          path: "/admin/dashboard/logout",
          icon: <FaSignOutAlt />,
        },
      ]);
    } else {
      setMenuLinks([
        {
          name: "Products",
          path: "/customer/dashboard",
          icon: <FaBox />,
          isParent: true,
        },
        {
          name: "Orders",
          path: "/customer/dashboard/orders",
          icon: <FaShoppingCart />,
        },
        {
          name: "Profile",
          path: "/customer/dashboard/profile",
          icon: <FaCog />,
        },
        {
          name: "Logout",
          path: "/customer/dashboard/logout",
          icon: <FaSignOutAlt />,
        },
      ]);
    }
  }, [user]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      background: "#0f172a",
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("pos-token");
        navigate("/");
      }
    });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center bg-black text-white p-2 fixed top-0 left-0 z-50 w-full shadow-md">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-2xl text-cyan-400"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
        <span className="ml-4 font-semibold text-cyan-400">SFMS</span>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 bg-black text-white shadow-md transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4">
          {!collapsed && (
            <span className="text-xl font-semibold text-cyan-400 hidden md:block">
              Stock Flow Management
            </span>
          )}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="text-cyan-400 text-xl"
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <ul className="space-y-2 px-2 mt-2">
          {menuLinks.map((item) => (
            <li key={item.name}>
              {item.name === "Logout" ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="group flex items-center w-full p-3 rounded-md hover:bg-gray-800 transition-all duration-300"
                >
                  <span className="text-xl text-cyan-400 group-hover:animate-bounce">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="ml-4 group-hover:text-cyan-300 transition-all duration-300 hidden md:block">
                      Logout
                    </span>
                  )}
                </button>
              ) : (
                <NavLink
                  end={item.isParent}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center p-3 rounded-md transition-all duration-300 ${
                      isActive
                        ? "bg-cyan-700 shadow-lg scale-[1.02]"
                        : "hover:bg-gray-800"
                    }`
                  }
                >
                  <span className="text-xl text-cyan-400 group-hover:animate-bounce">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="ml-4 group-hover:text-cyan-300 transition-all duration-300 hidden md:block">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
