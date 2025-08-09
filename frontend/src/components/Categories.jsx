import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5175/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancelEdit = () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action cannot be undone. All products in this category will need to be reassigned.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f9fafb",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `http://localhost:5175/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Deleted!",
          text: "Category has been removed successfully.",
          icon: "success",
          confirmButtonColor: "#059669",
          background: "#1f2937",
          color: "#f9fafb",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchCategories();
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete category. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "Something went wrong while deleting.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#1f2937",
        color: "#f9fafb",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editCategory
        ? `http://localhost:5175/api/category/${editCategory}`
        : "http://localhost:5175/api/category/add";

      const method = editCategory ? "put" : "post";

      const response = await axios[method](
        url,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        await Swal.fire({
          title: "Success!",
          text: editCategory
            ? "Category updated successfully!"
            : "Category added successfully!",
          icon: "success",
          confirmButtonColor: "#059669",
          background: "#1f2937",
          color: "#f9fafb",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to save category. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
      }

      setEditCategory(null);
      setCategoryName("");
      setCategoryDescription("");
      fetchCategories();
    } catch (error) {
      console.error(" Error submitting:", error);
      if (error.response) {
        console.log("🔎 Backend error response:", error.response.data);
        Swal.fire({
          title: "Error",
          text:
            error.response.data.message ||
            "Operation failed. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Network error. Please check your connection.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          background: "#1f2937",
          color: "#f9fafb",
        });
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading categories...</p>
        </motion.div>
      </div>
    );

  return (
    <motion.div
      className="text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8 text-cyan-400 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Category Management
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-cyan-300 flex items-center gap-2">
            {editCategory ? " Edit Category" : " Add New Category"}
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter category name (e.g., Car, Bike, etc.)"
                value={categoryName}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-gray-500"
                onChange={(e) => setCategoryName(e.target.value)}
                required
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">
                Category Description
              </label>
              <textarea
                placeholder="Enter category description"
                value={categoryDescription}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-gray-500 resize-none"
                onChange={(e) => setCategoryDescription(e.target.value)}
                required
                rows={3}
                maxLength={200}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 px-6 py-3 rounded-lg font-semibold transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/25"
              >
                {editCategory ? " Save Changes" : " Add Category"}
              </button>
              {editCategory && (
                <button
                  type="button"
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 px-6 py-3 rounded-lg font-semibold transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/25"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Table */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-cyan-500 transition-all duration-300"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-cyan-300 flex items-center gap-2">
              Category List
            </h2>
            <div className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
              {categories.length}{" "}
              {categories.length === 1 ? "category" : "categories"}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-700">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-cyan-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-700">
                <AnimatePresence>
                  {categories.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <div className="text-4xl mb-4"></div>
                          <p className="text-lg font-medium mb-2">
                            No categories found
                          </p>
                          <p className="text-sm">
                            Start by adding your first category above
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    categories.map((category, index) => (
                      <motion.tr
                        key={category._id}
                        className="hover:bg-gray-800 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          <span className="bg-cyan-600 text-white px-2 py-1 rounded-full text-xs">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {category.categoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm text-gray-300 max-w-xs truncate"
                            title={category.categoryDescription}
                          >
                            {category.categoryDescription}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center gap-1"
                              onClick={() => handleEdit(category)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-500/25 flex items-center gap-1"
                              onClick={() => handleDelete(category._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Categories;
