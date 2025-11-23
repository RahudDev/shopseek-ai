import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

interface HelpItem {
  title: string;
  icon: string;
  desc: string;
  blog: string; // detailed guide/blog content
}

const HelpComponent: React.FC = () => {
  const helpItems: HelpItem[] = [
    { 
      title: 'How to use AI Assistant', 
      icon: '🐸', 
      desc: 'Learn to chat with our AI for best results',
      blog: `
### How to Use AI Assistant

1. Go to the AI Assistant page.
2. Type your question in the chat box.
3. Click Send and wait for the AI response.
4. You can ask for product recommendations, price comparisons, or guidance.

**Tips:** Ask clear questions for best results!
      `
    },
    { 
      title: 'Price Comparison Guide', 
      icon: '💰', 
      desc: 'Understand how we compare prices',
      blog: `
### Price Comparison Guide

Our app compares prices across multiple platforms such as Amazon, Shopee, Lazada, and more.

- Enter a product name in the search box.
- Select platforms you want to compare.
- View a list of products with price, discount, and store information.
- Use the "Add to Cart" button to save your items.

**Tip:** Refresh results often to see the latest prices.
      `
    },
    { 
      title: 'Account Settings', 
      icon: '⚙️', 
      desc: 'Manage your profile and preferences',
      blog: `
### Account Settings

In Account Settings you can:

- Update your email and password
- Turn on dark mode / Light Mode
- Manage saved addresses

**Tip:** Always keep your email verified to ensure smooth usage.
      `
    },
    { 
      title: 'Contact Support', 
      icon: '📞', 
      desc: 'Get help from our support team',
      blog: `
### Contact Support

Need help? You can reach us:

- Email: rahudnainggolan@gmail.com

**Tip:** Include screenshots for faster resolution.
      `
    }
  ];

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="p-4">
      <h4 className="text-primary mb-4">Help & Support</h4>
      <div className="row">
        {helpItems.map((item, index) => (
          <div key={index} className="col-md-6 mb-3">
            <motion.div 
              className={`card h-100 border-0 shadow-sm ${selectedIndex === index ? "border-primary" : ""}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body text-center">
                <div style={{ fontSize: '3rem' }} className="mb-3">{item.icon}</div>
                <h6 className="text-primary">{item.title}</h6>
                <p className="text-muted small">{item.desc}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Render selected blog content */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 card border-0 shadow-sm bg-light"
          >
            <div style={{ whiteSpace: "pre-line" }}>
              {helpItems[selectedIndex].blog}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpComponent;
