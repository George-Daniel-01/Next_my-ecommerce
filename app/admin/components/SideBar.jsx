"use client";
import React, { useState } from "react";
import { LayoutDashboard, ListOrdered, Package, Users, User, LogOut, MoveLeft, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toggleComponent, toggleNavbar } from "@/app/store/slices/extraSlice";
import { logout } from "@/app/store/slices/authSlice";

const SideBar = () => {
  const [activeLink, setActiveLink] = useState(0);
  const links = [
    { icon: LayoutDashboard, title: "Dashboard" },
    { icon: ListOrdered, title: "Orders" },
    { icon: Package, title: "Products" },
    { icon: Users, title: "Users" },
    { icon: User, title: "Profile" },
  ];
  const { isNavbarOpened } = useSelector((state) => state.extra);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/admin/login");
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isNavbarOpened && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-[9] md:hidden"
          onClick={() => dispatch(toggleNavbar())}
        />
      )}
      <aside style={{
        position: "fixed",
        left: "10px",
        width: "256px",
        height: "calc(100vh - 20px)",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        zIndex: 10,
        top: "10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: isNavbarOpened || typeof window !== "undefined" && window.innerWidth >= 768 ? "translateX(0)" : "translateX(-120%)",
        transition: "transform 0.3s ease",
      }}>
        <nav>
          {/* Title */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#344767" }}>Admin Panel</h2>
              <MoveLeft 
                size={20} 
                style={{ cursor: "pointer", display: "none" }} 
                className="md:hidden block"
                onClick={() => dispatch(toggleNavbar())} 
              />
            </div>
            <hr style={{ borderColor: "#f0f0f0" }} />
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {links.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeLink === index;
              return (
                <button
                  key={index}
                  onClick={() => { setActiveLink(index); dispatch(toggleComponent(item.title)); }}
                  style={{
                    background: isActive ? "linear-gradient(195deg, #42424a, #191919)" : "transparent",
                    color: isActive ? "#ffffff" : "#344767",
                    width: "100%",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: isActive ? "600" : "400",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f8f8f8"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon size={20} color={isActive ? "#ffffff" : "#7b809a"} />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(195deg, #e25656, #cc0000)",
            color: "#ffffff",
            borderRadius: "8px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            width: "100%",
          }}
        >
          <LogOut size={18} color="#ffffff" />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
};
export default SideBar;