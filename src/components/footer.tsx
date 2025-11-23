import { motion } from "framer-motion";


// Footer Component
const FooterSection = () => {
  return (
    <motion.footer 
      className="py-5 text-white"
      style={{
        background: 'linear-gradient(45deg, #1976d2, #0d47a1)'
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-3 mb-4">
            <h5 className="fw-bold mb-3">🛍️ ShopSeek</h5>
            <p className="text-light">
              The smartest way to shop online. Save time, save money, shop better.
            </p>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold mb-3">Product</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Features</a></li>
              <li><a href="#" className="text-light text-decoration-none">Pricing</a></li>
              <li><a href="#" className="text-light text-decoration-none">API</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">About</a></li>
              <li><a href="#" className="text-light text-decoration-none">Blog</a></li>
              <li><a href="#" className="text-light text-decoration-none">Careers</a></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact</a></li>
              <li><a href="#" className="text-light text-decoration-none">Privacy</a></li>
            </ul>
          </div>
        </div>
        <hr className="border-light" />
        <div className="text-center">
          <p className="mb-0 text-light">
            © {new Date().getFullYear()} ShopSeek. All rights reserved. Made with ❤️ for smart shoppers.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default FooterSection;