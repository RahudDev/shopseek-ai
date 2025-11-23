import { motion } from "framer-motion";


  const HeaderSection = () => {
  return (
      <motion.nav 
        className="navbar navbar-expand-lg navbar-light"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(25,118,210,0.1)',
          position: 'relative',
          zIndex: 10
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <motion.a 
            className="navbar-brand fw-bold fs-4"
            href="#"
            style={{
              background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            whileHover={{ scale: 1.05 }}
          >
            🛍️ ShopSeek
          </motion.a>
          <div className="navbar-nav ms-auto d-none d-md-flex">
            <a href="#features" className="nav-link text-primary fw-medium">Features</a>
            <a href="#about" className="nav-link text-primary fw-medium">About</a>
            <a href="#download" className="nav-link text-primary fw-medium">Download</a>
          </div>
        </div>
      </motion.nav>

        );
};

export default HeaderSection;