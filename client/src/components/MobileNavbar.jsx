import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, User, Settings } from "lucide-react";
import "./MobileNavbar.css";

const navItems = [
  { label: "Home", icon: <Home />, to: "/" },
  { label: "History", icon: <History />, to: "/history" },
  { label: "Profile", icon: <User />, to: "/profile" },
  { label: "Settings", icon: <Settings />, to: "/settings" },
];

export default function MobileNavbar() {
  const location = useLocation();
  return (
    <nav className="mobile-navbar">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`mobile-nav-link${location.pathname === item.to ? " active" : ""}`}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span className="mobile-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
