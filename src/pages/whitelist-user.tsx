import { useState } from "react";
import { motion } from "framer-motion";
import { supabase_two } from "../Auth/Supabase";
import axios from "axios"; // for calling Brevo API

const WhitelistSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const brevoApiKey = process.env.REACT_APP_BREVO_API_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;

    try {
      // 1️⃣ Save email to Supabase table 'shopseek_whitelist' with status 'pending'
      const { error: insertError } = await supabase_two
        .from("shopseek_whitelist")
        .insert([{ email, status: "pending" }]);

      if (insertError) throw insertError;

      // 2️⃣ Generate a verification token (can be random string)
      const token = crypto.randomUUID();

      // Save token to the same table
      await supabase_two
        .from("shopseek_whitelist")
        .update({ verification_token: token })
        .eq("email", email);

      // 3️⃣ Send verification email via Brevo
      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { name: "ShopSeek", email: "support@shopseek.app" },
          to: [{ email }],
          subject: "Verify your email for ShopSeek whitelist",
          htmlContent: `
            <p>Hello,</p>
            <p>Click the link below to verify your email and join the ShopSeek whitelist:</p>
            <a href="${window.location.origin}/verify?token=${token}">Verify Email</a>
            <p>Thanks,<br/>Team ShopSeek</p>
          `,
        },
        {
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Try again later.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.section
      className="py-10 bg-gradient-to-r from-blue-50 to-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container text-center">
        <motion.h3
          className="display-6 fw-bold mb-3"
          style={{
            background: "linear-gradient(45deg, #1976d2, #0d47a1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Join the Whitelist
        </motion.h3>
        <p className="lead text-primary mb-5">
          Be among the first to experience ShopSeek and get early access to
          AI-powered deal hunting. Enter your email below:
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="d-flex flex-column flex-md-row justify-content-center gap-3"
          >
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Your email address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <motion.button
              type="submit"
              className="btn btn-primary btn-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 Join Whitelist
            </motion.button>
          </form>
        ) : (
          <motion.div
            className="alert alert-success mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎉 Thanks! Check your inbox to verify your email and complete
            whitelist signup.
          </motion.div>
        )}

        {error && (
          <motion.div
            className="alert alert-danger mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default WhitelistSection;
