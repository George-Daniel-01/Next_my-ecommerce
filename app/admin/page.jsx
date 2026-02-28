"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import SideBar from "@/app/admin/components/SideBar";
import Dashboard from "@/app/admin/components/Dashboard";
import { getDashboardStats } from "@/app/store/slices/adminSlice";
import { getUser } from "@/app/store/slices/authSlice";

const AdminOrders = React.lazy(() => import("@/app/admin/components/Orders"));
const AdminProducts = React.lazy(() => import("@/app/admin/components/Products"));
const AdminUsers = React.lazy(() => import("@/app/admin/components/Users"));
const AdminProfile = React.lazy(() => import("@/app/admin/components/Profile"));

export default function AdminPage() {
  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getUser());
    dispatch(getDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "Admin") return null;

  const renderContent = () => {
    switch (openedComponent) {
      case "Orders": return <React.Suspense fallback={<div className="p-10"><Loader className="animate-spin" /></div>}><AdminOrders /></React.Suspense>;
      case "Products": return <React.Suspense fallback={<div className="p-10"><Loader className="animate-spin" /></div>}><AdminProducts /></React.Suspense>;
      case "Users": return <React.Suspense fallback={<div className="p-10"><Loader className="animate-spin" /></div>}><AdminUsers /></React.Suspense>;
      case "Profile": return <React.Suspense fallback={<div className="p-10"><Loader className="animate-spin" /></div>}><AdminProfile /></React.Suspense>;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f3f3f6]">
      <SideBar />
      {renderContent()}
    </div>
  );
}