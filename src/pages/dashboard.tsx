import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import AIChat from "./dashboard/sidebar/chatcomponent";
import HistoryComponent from "./dashboard/sidebar/historycomponent";
import CartComponent from "./dashboard/sidebar/cartcomponent";
import BillingComponent from "./dashboard/sidebar/billingcomponent";
import HelpComponent from "./dashboard/sidebar/helpcomponent";
import Sidebar from "./dashboard/mainsidebar";
import Logout from "./dashboard/sidebar/logout";
import SettingsComponent from "./dashboard/sidebar/settings";


// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState("Guest");

  const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

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

 const renderContent = () => {
  switch (activeMenu) {
    case 'chat': return <AIChat />;
    case 'history': return <HistoryComponent />;
    case 'cart': return <CartComponent />;
    case 'help': return <HelpComponent />;
    case 'billing': return <BillingComponent />;
    case 'settings': return <SettingsComponent/>;
        case 'logout' : return <Logout/>;

    default: return <AIChat />;
  }
 };


  const getPageTitle = (): string => {
    const titles: { [key: string]: string } = {
      'chat': '💬 AI Shopping Assistant',
      'history': '📝 Search History',
      'cart': '🛒 My Cart',
      'help': '❓ Help & Support',
      'billing': '💳 Billing & Subscription'
    };
    return titles[activeMenu] || '💬 AI Shopping Assistant';
  };

  return (
    <div className="d-flex vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      {/* Main Content */}
      <div 
        className="d-flex flex-column vh-100" 
        style={{ 
          marginLeft: window.innerWidth >= 992 ? '280px' : '0',
          width: window.innerWidth >= 992 ? 'calc(100% - 280px)' : '100%',
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Top Navigation */}
        <nav className="navbar navbar-light bg-white border-bottom px-4">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-outline-primary d-lg-none me-3"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <h5 className="mb-0 text-primary">
              {getPageTitle()}
            </h5>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button 
                className="btn btn-outline-primary dropdown-toggle" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                👤 {userName}
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#">Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-grow-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-100"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;