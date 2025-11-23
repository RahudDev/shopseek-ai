// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase_two } from "../Auth/Supabase";

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification token.");
        return;
      }

      try {
        const { data, error } = await supabase_two
          .from("shopseek_whitelist")
          .select("*")
          .eq("verification_token", token)
          .single();

        if (error || !data) {
          setStatus("error");
          setMessage("Token not found or already verified.");
          return;
        }

        if (data.status === "verified") {
          setStatus("success");
          setMessage("Your email is already verified!");
          return;
        }

        const { error: updateError } = await supabase_two
          .from("shopseek_whitelist")
          .update({ status: "verified" })
          .eq("verification_token", token);

        if (updateError) {
          setStatus("error");
          setMessage("Failed to verify your email. Try again later.");
        } else {
          setStatus("success");
          setMessage("✅ Your email has been successfully verified!");
        }

      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.section
      className="py-10 bg-gradient-to-r from-blue-50 to-white min-h-screen flex items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container text-center">
        <motion.h3
          className="display-6 fw-bold mb-4"
          style={{
            background: "linear-gradient(45deg, #1976d2, #0d47a1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Email Verification
        </motion.h3>

        <motion.div
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {status === "loading" && (
            <p className="text-blue-700 text-lg">{message}</p>
          )}

          {status === "success" && (
            <>
              <p className="text-green-600 text-lg font-semibold mb-4">{message}</p>
              <motion.button
                onClick={() => navigate("/")}
                className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Home
              </motion.button>
            </>
          )}

          {status === "error" && (
            <>
              <p className="text-red-600 text-lg font-semibold mb-4">{message}</p>
              <motion.button
                onClick={() => navigate("/")}
                className="btn btn-secondary btn-lg px-5 py-3 rounded-pill"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go to Home
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default VerifyEmail;
