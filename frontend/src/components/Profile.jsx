import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Swal from "sweetalert2";
import api from "../utils/api";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const [otpStep, setOtpStep] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.user);
      setEditData({ name: res.data.user.name, email: res.data.user.email });
    } catch (err) {
      console.error("Error fetching profile:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch profile",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfileChanges = async () => {
    try {
      const res = await api.put(
        "/user/profile",
        { name: editData.name, email: editData.email }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#06b6d4",
        });
        setEditMode(false);
        fetchProfile();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await api.post("/user/send-otp", {});
      if (res.data.success) {
        setOtpStep(true);
        Swal.fire({
          icon: "info",
          title: "OTP sent to your email",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#06b6d4",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to send OTP",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }

    try {
      const res = await api.post(
        "/user/reset-password",
        { otp: emailOtp, newPassword }
      );
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Changed Successfully",
          background: "#0f172a",
          color: "#fff",
          confirmButtonColor: "#06b6d4",
        });
        setOtpStep(false);
        setEmailOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP or Server Error",
        background: "#0f172a",
        color: "#fff",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (loading) return <div className="text-white">Loading profile...</div>;
  if (!profile)
    return <div className="text-red-500">Failed to load profile.</div>;

  return (
    <div className="p-6 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen animate-fade-in-down transition-all duration-500">
      <h2 className="text-3xl font-bold text-cyan-400 mb-6">Profile</h2>

      <div className="bg-gray-800 rounded-xl p-6 shadow-lg w-full max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-cyan-300">
            Profile Details
          </h3>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-gray-400">Name:</label>
            {editMode ? (
              <input
                type="text"
                className="w-full mt-1 bg-gray-700 p-2 rounded-md"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            ) : (
              <p>{profile.name || "N/A"}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400">Email:</label>
            {editMode ? (
              <input
                type="email"
                className="w-full mt-1 bg-gray-700 p-2 rounded-md"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
              />
            ) : (
              <p>{profile.email || "N/A"}</p>
            )}
          </div>

          <div>
            <label className="text-gray-400">Role:</label>
            <p className="capitalize">{profile.role || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-400">Joined:</label>
            <p>
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {editMode && (
          <button
            className="w-full bg-cyan-500 hover:bg-cyan-600 mt-4 py-2 rounded-md font-semibold"
            onClick={saveProfileChanges}
          >
            Save Changes
          </button>
        )}

        {!otpStep ? (
          <button
            className="w-full bg-red-600 hover:bg-red-700 mt-4 py-2 rounded-md font-semibold"
            onClick={handleSendOtp}
          >
            Change Password
          </button>
        ) : (
          <div className="space-y-3 mt-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600"
            />
            <button
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-md font-semibold"
              onClick={handlePasswordReset}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
