"use client";
import React, { useState } from "react";
import Header from "@/app/admin/components/Header";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminPassword, updateAdminProfile } from "@/app/store/slices/authSlice";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [editData, setEditData] = useState({ name: user?.name || "", email: user?.email || "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [updatingSection, setUpdatingSection] = useState("");
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const dispatch = useDispatch();

  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    if (avatarFile) formData.append("avatar", avatarFile);
    setUpdatingSection("Profile");
    dispatch(updateAdminProfile(formData));
  };

  const updatePassword = () => {
    const formData = new FormData();
    Object.entries(passwordData).forEach(([k, v]) => formData.append(k, v));
    setUpdatingSection("Password");
    dispatch(updateAdminPassword(formData));
  };

  return (
    <main className="p-[10px] pl-[10px] md:pl-[17rem] w-full">
      <div className="flex-1 md:p-6 mb-4">
        <Header />
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-gray-600">Manage your profile.</p>
      </div>
      <div className="max-w-4xl md:px-4 py-4">
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
          <img src={user?.avatar?.url || "/avatar.jpg"} alt={user?.name} className="w-32 h-32 rounded-full object-cover border" />
          <div>
            <p className="text-xl font-medium">Name: {user?.name}</p>
            <p className="text-md text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-blue-500">Role: {user?.role}</p>
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="p-2 border rounded-md" placeholder="Your Name" />
            <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="p-2 border rounded-md" placeholder="Your Email" />
            <input type="file" onChange={(e) => setAvatarFile(e.target.files[0])} className="p-2 border rounded-md col-span-2" />
          </div>
          <button onClick={updateProfile} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 mt-4 rounded-lg">
            {loading && updatingSection === "Profile" ? "Updating..." : "Update Profile"}
          </button>
        </div>
        <div className="bg-gray-100 p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Update Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="p-2 border rounded-md" placeholder="Current Password" />
            <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="p-2 border rounded-md" placeholder="New Password" />
            <input type="password" value={passwordData.confirmNewPassword} onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} className="p-2 border rounded-md" placeholder="Confirm Password" />
          </div>
          <button onClick={updatePassword} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 mt-4 rounded-lg">
            {loading && updatingSection === "Password" ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </main>
  );
};
export default Profile;