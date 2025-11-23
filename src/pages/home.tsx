// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";
import StatsSection from "../components/home/stats";
import FeaturesSection from "../components/home/features";
import TestimonialsSection from "../components/home/testimonials";
import FooterSection from "../components/footer";
import HeaderSection from "../components/header";

// Main Home Component
const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: easeOut }
    }
  };

  return (
    <div 
      className="min-vh-100"
      style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 50%, #e1f5fe 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <motion.div 
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          style={{
            position: 'absolute',
            right: 0,
            top: '25%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(13,71,161,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

        <HeaderSection />

      {/* Hero Section */}
      <motion.section 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ position: 'relative', zIndex: 10 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container text-center">
          <motion.div variants={itemVariants} className="mb-5">
            <motion.h1 
              className="display-1 fw-black mb-4"
              style={{ 
                y: yRange,
                background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              ShopSeek
            </motion.h1>
            <motion.p 
              className="lead fs-3 text-primary mb-5"
              variants={itemVariants}
              style={{ maxWidth: '800px', margin: '0 auto' }}
            >
              Your AI-powered shopping companion that finds the <strong className="text-primary">best deals</strong> across 
              Amazon, eBay, Lazada, Shopee, and 50+ other platforms in seconds.
            </motion.p>
          </motion.div>

         <motion.div variants={itemVariants} className="mb-5">
  <motion.button
    className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg mb-4"
    style={{
      background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
      border: 'none',
      fontSize: '1.2rem'
    }}
    whileHover={{ 
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(25,118,210,0.4)"
    }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.href = "/whitelist"} // ✅ redirect to whitelist page
  >
    🚀 Get Early Access
  </motion.button>

  {/* ✅ Funny line + web version logo */}
 <div className="text-center mt-4">
  <p className="fw-bold mb-3" style={{ fontSize: "1.1rem" }}>
    Tired of waiting? 😅 No issue here, we got{" "}
    <span className="text-primary">Web Version</span>!
  </p>

  <motion.div whileHover={{ scale: 1.05 }}>
    <a href="/login">
      <img
        src="https://cdn-icons-png.flaticon.com/512/69/69524.png" 
        alt="Web Version Logo"
        style={{ height: "60px", cursor: "pointer" }}
        className="img-fluid mb-4"
      />
    </a>
  </motion.div>
</div>




  <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center mt-4">
    <p className="text-primary mb-3 mb-sm-0 me-sm-4">Coming Soon:</p>
    <div className="d-flex gap-3">
      <motion.div whileHover={{ scale: 1.1 }} style={{ cursor: 'pointer' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
          alt="Get it on Google Play" 
          style={{ height: '50px' }}
          className="img-fluid"
        />
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} style={{ cursor: 'pointer' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
          alt="Download on the App Store" 
          style={{ height: '50px' }}
          className="img-fluid"
        />
      </motion.div>
    </div>
  </div>
</motion.div>


          <StatsSection />
        </div>
      </motion.section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Download Section */}
      <motion.section 
        id="download"
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
          position: 'relative',
          zIndex: 10
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
      <div className="container text-center">
  <motion.div variants={itemVariants}>
    <h2 className="display-4 fw-bold mb-4">
      <span style={{
        background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Ready to Start Saving Time?
      </span>
    </h2>
    <p className="lead text-primary mb-5">
      Join the beta and let ShopSeek instantly find the best products with top ratings and reviews—no more wasting hours browsing online stores!
    </p>
    
    <motion.div 
      className="card shadow-lg p-5 mb-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '25px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(25,118,210,0.1)'
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="row align-items-center">
        <div className="col-md-8 text-md-start">
          <h3 className="h4 fw-bold mb-2 text-primary">Early Bird Special</h3>
          <p className="text-primary mb-0">
            Get lifetime premium features and save hours every week—discover top-rated products instantly ☕
          </p>
        </div>
        <div className="col-md-4 mt-3 mt-md-0">
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                style={{ height: '60px', cursor: 'pointer' }}
                className="img-fluid"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="Download on the App Store" 
                style={{ height: '60px', cursor: 'pointer' }}
                className="img-fluid"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>

    <div className="d-flex flex-wrap justify-content-center gap-4 text-primary">
      <small>✨ No credit card required</small>
      <small>🔒 100% secure</small>
      <small>📱 Works on all devices</small>
      <small>⏱️ Save hours every week</small>
    </div>
  </motion.div>
</div>

      </motion.section>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default Home;
