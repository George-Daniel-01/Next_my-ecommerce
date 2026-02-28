"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/app/store/slices/authSlice";
import { Toaster } from "react-hot-toast";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role === "Admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email: formData.email, password: formData.password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4">
      <Toaster position="bottom-center" />
      <div className="bg-white shadow-lg rounded-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required placeholder="Enter admin email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-white" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}