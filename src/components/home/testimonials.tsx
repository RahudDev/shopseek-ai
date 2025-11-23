import { motion } from "framer-motion";
import { easeOut } from "framer-motion/dom";

// Testimonials Component
const TestimonialsSection = () => {
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

  const testimonials = [
    {
      name: "Alice Tan",
      role: "Busy Professional",
      text: "ShopSeek saves me hours every week! Instead of checking multiple e-commerce sites, the AI finds the best products and reviews in seconds.",
      avatar: "👩‍💼"
    },
    {
      name: "David Lim",
      role: "Smart Shopper",
      text: "I love how ShopSeek filters out low-rated items and shows me only the top products. No more wasting time scrolling endlessly!",
      avatar: "👨‍💻"
    },
    {
      name: "Siti Rahma",
      role: "Budget-Conscious Mom",
      text: "This app helps me make smarter choices and save money. I trust ShopSeek to quickly find the best deals with real user feedback.",
      avatar: "👩‍🎓"
    },
    {
      name: "Michael Wong",
      role: "Tech Enthusiast",
      text: "The AI does all the heavy lifting. I can instantly see which products have the highest ratings and best reviews across Amazon, eBay, and more.",
      avatar: "🧑‍💻"
    },
    {
      name: "Nur Aisyah",
      role: "Frequent Online Shopper",
      text: "ShopSeek is a game-changer! I no longer spend hours comparing products manually. Everything I need is displayed in seconds.",
      avatar: "👩‍💼"
    }
  ];

  return (
    <motion.section 
      className="py-10 bg-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="container">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="display-4 fw-bold mb-3">
            <span style={{
              background: 'linear-gradient(45deg, #1976d2, #0d47a1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              What Users Say
            </span>
          </h2>
          <p className="lead text-primary">Saving time, finding top-rated products instantly</p>
        </motion.div>

        <div className="row">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="col-md-4 mb-4"
            >
              <motion.div
                className="card h-100 shadow-lg border-primary"
                style={{ borderRadius: '20px' }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 40px rgba(0,123,255,0.2)"
                }}
              >
                <div className="card-body p-4 text-center">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>
                    {testimonial.avatar}
                  </div>
                  <p className="card-text text-primary fs-6 fst-italic mb-4">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <h6 className="text-primary fw-bold mb-1">{testimonial.name}</h6>
                    <small className="text-muted">{testimonial.role}</small>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
