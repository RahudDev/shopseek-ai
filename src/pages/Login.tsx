// src/pages/GoogleLogin.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../Auth/Supabase";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedGoogleJWT {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
}

const GoogleLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const decodeJwt = (token: string): DecodedGoogleJWT | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error("JWT decode error:", err);
      return null;
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: google_client_id,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv")!,
          { theme: "filled_blue", size: "large", width: "100%", text: "continue_with" }
        );
      }
    };
    document.head.appendChild(script);
    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

  const handleCredentialResponse = async (response: GoogleCredentialResponse) => {
    setIsLoading(true);
    try {
      const decoded = decodeJwt(response.credential);
      if (!decoded?.email) {
        showToast("Invalid Google login data.");
        return;
      }

      // ✅ Try to get existing user first
      const { data: existingUser, error: fetchError } = await supabase
        .from("shopseek_user")
        .select("uuid")
        .eq("email", decoded.email)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching user:", fetchError);
        showToast("Login failed. Try again.");
        return;
      }

      let userUuid = existingUser?.uuid || uuidv4(); // use existing UUID if exists

      // ✅ Upsert user: create if new, update if exists
      const { error: upsertError } = await supabase
        .from("shopseek_user")
        .upsert(
          {
            uuid: userUuid,
            email: decoded.email,
            google_id: decoded.sub,
            name: decoded.name || "",
            avatar: decoded.picture || "",
            is_premium: false,
          },
          { onConflict: "email" }
        );

      if (upsertError) {
        console.error("Error upserting user:", upsertError);
        showToast("Login failed. Try again.");
        return;
      }

      // ✅ Save user info in cookie
      Cookies.set(
        "shop_seek_client",
        JSON.stringify({
          email: decoded.email,
          google_id: decoded.sub,
          name: decoded.name,
          pic: decoded.picture,
        }),
        { expires: 7, sameSite: "Strict" }
      );

      // ✅ Redirect to main page
      window.location.href = "/main";
    } catch (err) {
      console.error("Google login error:", err);
      showToast("Google login error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ padding: "1rem" }}>
      <motion.div
        className="card shadow-lg p-5 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ maxWidth: "400px", width: "100%", borderRadius: "20px" }}
      >
        <motion.img
          src="https://cdn-icons-png.flaticon.com/512/69/69524.png"
          alt="Web Version Globe"
          style={{ height: "60px", marginBottom: "1rem" }}
          whileHover={{ scale: 1.1 }}
        />
        <h3 className="mb-3 text-primary">Welcome to ShopSeek</h3>
        <p className="mb-4">Find the best deals from your favorite stores. Login with Google to get started!</p>
        <div id="googleSignInDiv" style={{ width: "100%" }}></div>
        {isLoading && <p className="mt-3 text-muted">Authenticating...</p>}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#f44336",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              zIndex: 1000,
            }}
          >
            {toastMessage}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GoogleLogin;
