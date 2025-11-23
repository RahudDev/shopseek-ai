import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

import * as AiIcons from "react-icons/ai";

interface MenuItem {
  id: string;
  icon: React.ReactNode; // ← use ReactNode instead of ReactElement
  label: string;
  badge: string | null;
}

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

// Helper to read a cookie by name
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  setActiveMenu,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const cookieValue = getCookie("shop_seek_client");
    if (cookieValue) {
      try {
        // Assume cookie stores JSON: { "name": "Real Name", ... }
        const parsed = JSON.parse(cookieValue);
        if (parsed.name) setUserName(parsed.name);
      } catch {
        setUserName(cookieValue); // fallback to raw cookie string
      }
    }
  }, []);

 const menuItems: MenuItem[] = [
  { id: "chat", icon: <AiIcons.AiOutlineRobot size={20} />, label: "AI Assistant", badge: null },
  { id: "history", icon: <AiIcons.AiOutlineHistory size={20} />, label: "Search History", badge: null },
  { id: "cart", icon: <AiIcons.AiOutlineShoppingCart size={20} />, label: "My Cart", badge: null },
  { id: "help", icon: <AiIcons.AiOutlineQuestionCircle size={20} />, label: "Help & Support", badge: null },
  { id: "billing", icon: <AiIcons.AiOutlineCreditCard size={20} />, label: "Subscription", badge: null },
  { id: "settings", icon: <AiIcons.AiOutlineSetting size={20} />, label: "Settings", badge: null },
  { id: "logout", icon: <AiIcons.AiOutlineLogout size={20} />, label: "Logout", badge: null },
];

  const handleMenuClick = (itemId: string): void => {
    setActiveMenu(itemId);
    if (window.innerWidth < 992) setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="d-lg-none position-fixed w-100 h-100"
          style={{
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`d-flex flex-column h-100 ${
          isSidebarOpen ? "d-block" : "d-none d-lg-flex"
        }`}
        style={{
          width: "280px",
          minWidth: "280px",
          background: "linear-gradient(180deg, #1976d2 0%, #0d47a1 100%)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1050,
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
        }}
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen || window.innerWidth >= 992 ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="p-4 border-bottom border-light border-opacity-25">
          <h4 className="text-white fw-bold mb-0">🛍️ ShopSeek</h4>
          <small className="text-light opacity-75">AI Shopping Assistant</small>
        </div>

        {/* Navigation */}
        <div className="flex-grow-1 py-3">
          {menuItems.map((item: MenuItem) => (
            <motion.div
              key={item.id}
              className={`px-3 py-2 mx-2 rounded-3 mb-1 cursor-pointer position-relative ${
                activeMenu === item.id ? "bg-white bg-opacity-25" : "hover-bg-light"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleMenuClick(item.id)}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="d-flex align-items-center text-white">
                <span className="fs-5 me-3">{item.icon}</span>
                <span className="fw-medium">{item.label}</span>
                {item.badge && (
                  <span className="badge bg-warning text-dark ms-auto">{item.badge}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-3 border-top border-light border-opacity-25">
          <div className="d-flex align-items-center text-white">
            <div
              className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center me-3"
              style={{ width: "40px", height: "40px" }}
            >
              👤
            </div>
            <div>
              <div className="fw-medium">{userName}</div>
              <small className="opacity-75">Free</small>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;