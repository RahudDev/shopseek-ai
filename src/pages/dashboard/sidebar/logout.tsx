// src/components/Logout.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Auth/Supabase";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear all localStorage
      localStorage.clear();

      // Clear all cookies (including possible paths/domains)
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      });

      // Redirect to login page
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Cancel → go back to dashboard
    window.location.href = "/main";
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      {showConfirm && (
        <div className="card shadow p-4 text-center" style={{ maxWidth: "400px" }}>
          <h5 className="mb-3">Are you sure you want to log out?</h5>
          <div className="d-flex justify-content-around">
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
