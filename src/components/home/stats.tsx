import { motion } from "framer-motion";


const StatsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="row justify-content-center mt-5"
    >
      {[
        { number: "50M+", label: "Products Scanned" },
        { number: "100+", label: "Store Partners" },
        { number: "Coming soon", label: "App Rating" }
      ].map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="col-6 col-md-3 mb-4"
        >
          <motion.div
            className="card h-100 shadow-lg border-primary"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(0,123,255,0.3)"
            }}
          >
            <div className="card-body text-center p-4">
              <h3 className="text-primary fw-bold mb-2" style={{ fontSize: '2rem' }}>
                {stat.number}
              </h3>
              <p className="text-primary mb-0 fw-medium">{stat.label}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsSection;