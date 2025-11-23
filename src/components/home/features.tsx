// src/components/FeaturesSection.tsx
import React from "react";
import { motion, easeOut } from "framer-motion";

// Features Component
const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: easeOut } }
  };

  const features = [
    {
      icon: "🔍",
      title: "AI-Powered Search",
      description: "Advanced machine learning algorithms scan millions of products across multiple platforms"
    },
    {
      icon: "💰",
      title: "Price Comparison",
      description: "Real-time price tracking and comparison across Amazon, eBay, Lazada, Shopee & more"
    },
    {
      icon: "⚡",
      title: "Instant Results",
      description: "Get the best deals in seconds with our lightning-fast search technology"
    },
    {
      icon: "🛡️",
      title: "Secure & Private",
      description: "Your shopping data is encrypted and never shared with third parties"
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Optimized for mobile shopping with intuitive gesture controls"
    },
    {
      icon: "🎯",
      title: "Smart Alerts",
      description: "Get notified when prices drop on items you're watching"
    }
  ];

  return (
    <motion.section 
      id="features"
      className="py-5"
      style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
      }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container">
        <motion.div variants={itemVariants} className="text-center mb-5">
          <h2 className="display-4 fw-bold mb-4">
            <span style={{
              background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Powerful Features
            </span>
          </h2>
          <p className="lead text-primary">
            Experience the future of smart shopping with cutting-edge AI technology
          </p>
        </motion.div>

        <div className="row">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="col-md-6 col-lg-4 mb-4"
            >
              <motion.div
                className="card h-100 shadow-lg border-0"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 15px 40px rgba(0,123,255,0.2)"
                }}
              >
                <div className="card-body p-4">
                  <div 
                    className="mb-3 d-inline-block p-3 rounded-3 text-white"
                    style={{
                      background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
                      fontSize: '2rem'
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h5 className="card-title text-primary fw-bold">
                    {feature.title}
                  </h5>
                  <p className="card-text text-primary">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
