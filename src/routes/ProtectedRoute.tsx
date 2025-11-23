// src/components/ProtectedRoute.tsx
import React, { useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("shop_seek_client");
    if (!cookie) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(cookie);
      if (user?.google_id && user?.email) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (err) {
      console.error("Cookie parse error:", err);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center mt-5">Checking authentication...</p>;

  if (!isAuthorized) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
