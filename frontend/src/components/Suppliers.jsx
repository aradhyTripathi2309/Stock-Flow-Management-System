import React, { useState, useEffect } from "react";
import axios from "axios";

const Suppliers = () => {
  const [showModel, setShowModel] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search input state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5175/api/supplier", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setFormData({
      supplierName: supplier.supplierName,
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
      supplierAddress: supplier.supplierAddress,
    });
    setEditSupplier(supplier._id);
    setShowModel(true);
  };

  const closeModel = () => {
    setShowModel(false);
    setEditSupplier(null);
    setFormData({
      supplierName: "",
      supplierEmail: "",
      supplierPhone: "",
      supplierAddress: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editSupplier
      ? `http://localhost:5175/api/supplier/${editSupplier}`
      : "http://localhost:5175/api/supplier/add";

    const method = editSupplier ? "put" : "post";

    try {
      const response = await axios[method](
        url,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        alert(
          editSupplier
            ? "Supplier updated successfully!"
            : "Supplier added successfully!"
        );
        closeModel();
        fetchSuppliers();
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      if (error.response) {
        alert(error.response.data.message || "Submission failed.");
      } else {
        alert("Something went wrong.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5175/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Supplier deleted successfully");
        fetchSuppliers();
      } else {
        alert("Failed to delete supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Something went wrong while deleting");
    }
  };

  // 🔍 Filter suppliers based on search query
  const filteredSuppliers = suppliers.filter((supplier) =>
    [
      supplier.supplierName,
      supplier.supplierEmail,
      supplier.supplierPhone,
    ].some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen p-8 transition-all duration-500">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400 animate-fade-in-down">
        Suppliers Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 px-4 rounded bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={() => {
            setEditSupplier(null);
            setShowModel(true);
          }}
        >
          Add Supplier
        </button>
      </div>

      {!loading ? (
        <table className="min-w-full bg-gray-800 rounded-lg shadow-lg">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                S No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Supplier Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier, index) => (
              <tr key={supplier._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {supplier.supplierName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {supplier.supplierEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {supplier.supplierPhone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {supplier.supplierAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Loading....</div>
      )}

      {showModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md relative shadow-2xl border border-cyan-500">
            <button
              className="absolute top-3 right-4 text-white text-xl hover:text-red-500"
              onClick={closeModel}
            >
              X
            </button>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              {editSupplier ? "Update Supplier" : "Add Supplier"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="supplierName"
                placeholder="Supplier Name"
                value={formData.supplierName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="email"
                name="supplierEmail"
                value={formData.supplierEmail}
                onChange={handleChange}
                placeholder="Supplier Email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="number"
                name="supplierPhone"
                value={formData.supplierPhone}
                onChange={handleChange}
                placeholder="Supplier Phone Number"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <input
                type="text"
                name="supplierAddress"
                value={formData.supplierAddress}
                onChange={handleChange}
                placeholder="Supplier Address"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded font-semibold transition"
              >
                {editSupplier ? "Update Supplier" : "Add Supplier"}
              </button>

              <button
                type="button"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold transition mt-2"
                onClick={closeModel}
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

export default Suppliers;
