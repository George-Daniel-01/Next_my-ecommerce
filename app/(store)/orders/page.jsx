"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { fetchMyOrders } from "@/app/store/slices/orderSlice";
import Navbar from "@/app/components/Layout/Navbar";
import Sidebar from "@/app/components/Layout/Sidebar";
import SearchOverlay from "@/app/components/Layout/SearchOverlay";
import CartSidebar from "@/app/components/Layout/CartSidebar";
import ProfilePanel from "@/app/components/Layout/ProfilePanel";
import LoginModal from "@/app/components/Layout/LoginModal";
import Footer from "@/app/components/Layout/Footer";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) { router.push("/products"); return; }
    dispatch(fetchMyOrders());
    const interval = setInterval(() => dispatch(fetchMyOrders()), 30000);
    return () => clearInterval(interval);
  }, [dispatch, authUser, router]);

  const filterOrders = myOrders.filter((order) => statusFilter === "All" || order.order_status === statusFilter);
  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped": return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-500/20 text-yellow-400";
      case "Shipped": return "bg-blue-500/20 text-blue-400";
      case "Delivered": return "bg-green-500/20 text-green-400";
      case "Cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar /><Sidebar /><SearchOverlay /><CartSidebar /><ProfilePanel /><LoginModal />
        <div className="min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
            <div className="glass-card p-4 mb-8">
              <div className="flex items-center space-x-4 flex-wrap">
                <Filter className="w-5 h-5 text-primary" />
                <div className="flex flex-wrap gap-2">
                  {statusArray.map((status) => (
                    <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === status ? "gradient-primary text-primary-foreground" : "glass-card hover:glow-on-hover text-foreground"}`}>{status}</button>
                  ))}
                </div>
              </div>
            </div>
            {filterOrders.length === 0 ? (
              <div className="text-center glass-panel max-w-md mx-auto"><Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h2 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h2></div>
            ) : (
              <div className="space-y-6">
                {filterOrders.map((order) => (
                  <div key={order.id} className="glass-card p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                      <div><h3 className="text-lg font-semibold text-foreground mb-1">Order #{order.id}</h3><p className="text-muted-foreground">Placed on {new Date(order.created_at).toLocaleDateString()}</p></div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">{getStatusIcon(order.order_status)}<span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.order_status)}`}>{order.order_status}</span></div>
                        <p className="text-xl font-bold text-primary">${order.total_price}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order?.order_items?.map((item) => (
                        <div key={item.product_id} className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1"><h4 className="font-medium text-foreground">{item.title}</h4><p className="text-sm text-muted-foreground">Qty: {item.quantity}</p></div>
                          <p className="font-semibold text-foreground">${item.price}</p>
                        </div>
                      ))}
                    </div>
                    {order.order_status === "Delivered" && (
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                        {order?.order_items?.map((item) => (
                          <Link key={item.product_id} href={`/product/${item.product_id}`} className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">Write Review</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}

