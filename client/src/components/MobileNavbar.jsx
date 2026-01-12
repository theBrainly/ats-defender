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

export default /**
 * Active: 2026-01-02
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-03
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-05
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-06
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-07
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-10
 * Function: MobileNavbar
 */
/**
 * Active: 2026-01-12
 * Function: MobileNavbar
 */
function MobileNavbar() {
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
