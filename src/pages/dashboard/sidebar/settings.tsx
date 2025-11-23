import React, { useState, useEffect } from "react";
import { supabase } from "../../../Auth/Supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUserUuid } from "../../../function/getclientuuid";
import Cookies from "js-cookie";

const SettingsComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const uuid = await getUserUuid();
      if (!uuid) return;

      // Fetch user info
      const { data: userData, error: userError } = await supabase
        .from("shopseek_user")
        .select("email, name")
        .eq("uuid", uuid)
        .maybeSingle();

      if (!userError && userData) {
        setEmail(userData.email || "");
        setName(userData.name || "");
      }

      setLoading(false);
    };

    fetchSettings();
  }, []);

  // Handle Dark Mode toggle
  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    // Apply class to main page body (excluding sidebar)
    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    window.location.reload(); // refresh page to apply mode everywhere
  };

  const handleNameUpdate = async () => {
    const uuid = await getUserUuid();
    if (!uuid) return;

    const { error } = await supabase
      .from("shopseek_user")
      .update({ name })
      .eq("uuid", uuid);

    if (error) {
      alert("Failed to update name");
    } else {
      // Update cookie using js-cookie
      const cookieName = "shop_seek_client";
      const existingCookie = Cookies.get(cookieName);

      if (existingCookie) {
        try {
          const parsed = JSON.parse(existingCookie);
          parsed.name = name;
          Cookies.set(cookieName, JSON.stringify(parsed), { path: "/", expires: 365 });
        } catch (err) {
          console.error("Failed to parse cookie:", err);
        }
      }

      alert("✅ Name updated successfully! Refreshing page...");
      window.location.reload();
    }
  };

  useEffect(() => {
    // Apply dark mode on page load
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className={`p-4 ${darkMode ? "bg-dark text-light" : ""}`} style={{ minHeight: "100vh" }}>
      <h4 className="mb-4 text-primary">Account Settings</h4>

      {/* Email (read-only) */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" value={email} disabled />
      </div>

      {/* Name (editable) */}
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleNameUpdate}>
          Update Name
        </button>
      </div>


      <small className="text-muted">
        Tip: Always keep your email verified to ensure smooth usage.
      </small>
    </div>
  );
};

export default SettingsComponent;
