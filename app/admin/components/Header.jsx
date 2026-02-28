"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";
import { toggleNavbar } from "@/app/store/slices/extraSlice";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { openedComponent } = useSelector((state) => state.extra);
  const dispatch = useDispatch();

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #f0f0f0" }}>
      <p style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#344767" }}>
        <span style={{ color: "#7b809a" }}>{user?.name}</span>
        <span>/</span>
        <span style={{ fontWeight: "600" }}>{openedComponent}</span>
      </p>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Menu className="block md:hidden cursor-pointer" onClick={() => dispatch(toggleNavbar())} />
        <img
          src={user?.avatar?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "Admin") + "&background=random"}
          alt={user?.name || "avatar"}
          style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e0e0e0" }}
          onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"; }}
        />
      </div>
    </header>
  );
};
export default Header;