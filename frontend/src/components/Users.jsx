import React, { useState, useEffect } from "react";
import api from "../utils/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/user${roleFilter ? `?role=${roleFilter}` : ""}`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await api.delete(`/user/${id}`);
      if (response.data.success) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Something went wrong while deleting user");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setEditUserId(user._id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditUserId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = editUserId
        ? await api.put(`/user/${editUserId}`, formData)
        : await api.post("/user/", formData);

      if (response.data.success) {
        alert(
          editUserId ? "User updated successfully" : "User added successfully"
        );
        closeModal();
        fetchUsers();
      } else {
        alert("Operation failed.");
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen p-8 transition-all duration-500 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400 animate-fade-in-down">
        Users Management
      </h1>

      <div className="flex justify-between items-center mb-6 animate-slide-in-left">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={() => {
            setEditUserId(null);
            setFormData({
              name: "",
              email: "",
              password: "",
              role: "customer",
            });
            setShowModal(true);
          }}
        >
          Add User
        </button>
      </div>

      {!loading ? (
        <table className="min-w-full bg-gray-800 rounded-lg shadow-lg animate-fade-in-down">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                S No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-700 animate-fade-in-down">
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-300">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-cyan-400 italic animate-fade-in"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="text-cyan-400 animate-pulse font-semibold">
          Loading users...
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-2xl border border-cyan-500 animate-slide-in-up">
            <button
              className="absolute top-3 right-4 text-white text-xl hover:text-red-500"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {editUserId ? "Update User" : "Add User"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              {!editUserId && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                />
              )}
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 text-white"
              >
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-semibold transition"
              >
                {editUserId ? "Update User" : "Add User"}
              </button>
              <button
                type="button"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition mt-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
