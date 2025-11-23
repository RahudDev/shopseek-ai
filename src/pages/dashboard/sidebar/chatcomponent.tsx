import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../../../Auth/Supabase";
import { handleAddToCart } from "../../../components/cart";
import { getUserUuid } from "../../../function/getclientuuid";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  timestamp: string;
  products?: Product[];
}

interface Product {
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  store: string;
  rating?: string;
  image?: string;
  link?: string;
  id? : string;
}

const platforms = ["Shopee", "Amazon", "Lazada", "eBay", "Tokopedia"];

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hi! I'm your AI shopping assistant. I can help you find the best deals across Amazon, eBay, Lazada, Shopee, and more. Which platform would you like to search?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platforms[0]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

const handleSendMessage = async (): Promise<void> => {
  if (!inputMessage.trim() && !imageFile) return;

  const userMessage: Message = {
    id: Date.now(),
    type: "user",
    content: inputMessage,
    timestamp: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputMessage("");
  setIsTyping(true);


   let parsedProducts: Product[] = [];
  try {
    // --- Step 1: Get user IP and country ---
    let countryName = "Unknown";
    try {
      const ipRes = await fetch("https://ipapi.co/json/"); // Free IP geolocation
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        countryName = ipData.country_name || "Unknown";
      }
    } catch (ipErr) {
      console.warn("IP detection failed:", ipErr);
    }

    // --- Step 2: Prepare payload for Edge Function ---
const payload: any = {
  platform: selectedPlatform,
  input: inputMessage,
  instructions: `
You are a professional AI shopping assistant. Your task is to:

1. Search for real products on the platform "${selectedPlatform}" for the query: "${inputMessage}" available in the user's country: ${countryName}.
2. Only include products that have **high ratings (4 stars or above)** and are verifiable on the platform.
3. Provide the following fields for each product:
   - name
   - price
   - originalPrice
   - discount
   - rating
   - store/platform
   - image URL
   - direct product link
4. Format the output as a clean JSON array like this:

[
  {
    "name": "",
    "price": "",
    "originalPrice": "",
    "discount": "",
    "rating": "",
    "store": "",
    "image": "",
    "link": ""
  }
]

5. Respond **only with real products** found in the search, do not invent any product.
6. Keep it concise and focus on the **best deals only**.
`,
};



    // --- Step 3: Include image if uploaded ---
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          payload.image = reader.result;
          resolve();
        };
      });
    }

    // --- Step 4: Call Supabase Edge Function ---
    const response = await fetch(
      "https://nfqxpercryikxoatddan.supabase.co/functions/v1/smart-worker",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    const rawBotText = data.output?.[0]?.content?.[0]?.text?.trim() || "";

    let botMessage: Message;
    try {
          parsedProducts = JSON.parse(rawBotText);
      botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Here are the best deals I found:",
        timestamp: new Date().toLocaleTimeString(),
         products: parsedProducts,
      };
    } catch {
      botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: rawBotText || "⚠️ No response received. Try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
    }

    setMessages((prev) => [...prev, botMessage]);


  // --- Helper to get cookie safely ---
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// --- Step 5: Save search history for current user ---
const cookieValue = getCookie("shop_seek_client");

if (cookieValue) {
  try {
    // If cookie is wrapped in quotes, remove them
    let cleaned = cookieValue;
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }

    const parsedCookie = JSON.parse(cleaned);
    const userEmail = parsedCookie.email;

    if (userEmail) {
      // Fetch the user's UUID from Supabase
      const { data: userData, error: userError } = await supabase
        .from("shopseek_user")
        .select("uuid")
        .eq("email", userEmail)
        .maybeSingle();

      if (userError) {
        console.error("Error fetching user UUID:", userError);
      } else if (userData?.uuid) {
        const { error: insertError } = await supabase
          .from("shopseek_client_history")
          .insert([
            {
              user_uuid: userData.uuid,
              query: inputMessage,
              platform: selectedPlatform,
              results: parsedProducts.length ? parsedProducts : [],
            },
          ]);

        if (insertError) {
          console.error("Error inserting history:", insertError);
        } else {
          console.log("Search history saved successfully!");
        }
      } else {
        console.warn("No UUID found for email:", userEmail);
      }
    }
  } catch (err) {
    console.error("Failed to parse cookie or save history:", err);
  }
} else {
  console.warn("shop_seek_client cookie not found");
}


  } catch (error) {
    console.error(error);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        type: "bot",
        content: "❌ Error generating deals. Check console.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  } finally {
    setIsTyping(false);
    setImageFile(null);
  }
};

  const [cartStatus, setCartStatus] = useState<{ [key: string]: string }>({});
  // ✅ Handle button click with status updates
  const onAddToCart = async (product: any) => {
    const productKey = product.id || product.name; // use id if available, else fallback name
    setCartStatus((prev) => ({ ...prev, [productKey]: "loading" }));

    const uuid = await getUserUuid();
    if (!uuid) {
      alert("⚠️ You must be logged in to add to cart");
      setCartStatus((prev) => ({ ...prev, [productKey]: "idle" }));
      return;
    }

    try {
      await handleAddToCart(product, uuid);
      setCartStatus((prev) => ({ ...prev, [productKey]: "added" }));
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartStatus((prev) => ({ ...prev, [productKey]: "idle" }));
    }
  };



  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-100 d-flex flex-column">
      {/* Chat Header */}
      <div className="p-4 border-bottom" style={{ background: "linear-gradient(90deg, #e3f2fd, #ffffff)" }}>
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 text-primary">AI Shopping Assistant</h5>
          <select
            className="form-select form-select-sm w-auto"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
          >
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

     {/* Chat Messages */}
      <div className="flex-grow-1 p-4 overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
        <AnimatePresence>
          {messages.map((message: Message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 d-flex ${message.type === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`d-flex ${message.type === "user" ? "flex-row-reverse" : "flex-row"} align-items-start`}
                style={{ maxWidth: "80%" }}
              >
                <div
                  className={`rounded-circle p-2 ${message.type === "user" ? "bg-primary ms-2" : "bg-light me-2"}`}
                  style={{ minWidth: "40px", height: "40px" }}
                >
                  <span className={message.type === "user" ? "text-white" : "text-primary"}>
                    {message.type === "user" ? "👤" : "🐸"}
                  </span>
                </div>
                <div style={{ width: "100%" }}>
                  <div
                    className={`p-3 rounded-4 ${
                      message.type === "user" ? "bg-primary text-white" : "bg-light text-dark border"
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <small className={`opacity-75 ${message.type === "user" ? "text-light" : "text-muted"}`}>
                      {message.timestamp}
                    </small>
                  </div>

                  {/* Render Products */}
                 {message.products && message.products.length > 0 && (
  <div className="mt-3">
    <div className="row g-2">
      {message.products.map((product, idx) => {
        const productKey = product.id || product.name;
        const status = cartStatus[productKey] || "idle";

        return (
          <div key={idx} className="col-md-4">
            <motion.div
              className="card border-0 shadow-sm h-100"
              whileHover={{ scale: 1.02 }}
            >
              {product.image && (
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ objectFit: "cover", maxHeight: "180px" }}
                />
              )}
              <div className="card-body d-flex flex-column p-3">
                <h6 className="card-title text-primary mb-1">{product.name}</h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <span className="fw-bold text-success">{product.price}</span>
                    {product.originalPrice && (
                      <small className="text-muted text-decoration-line-through ms-1">
                        {product.originalPrice}
                      </small>
                    )}
                  </div>
                  {product.discount && (
                    <span className="badge bg-danger">{product.discount}</span>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">{product.store}</small>
                  {product.rating && (
                    <small className="text-warning">⭐ {product.rating}</small>
                  )}
                </div>

                {/* ✅ Actions Row */}
                <div className="mt-auto d-flex gap-2">
                  {product.link && (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm flex-fill"
                    >
                      View
                    </a>
                  )}

                  {status === "idle" && (
                    <button
                      className="btn btn-success btn-sm flex-fill"
                      onClick={() => onAddToCart(product)}
                    >
                      Add 🛒
                    </button>
                  )}

                  {status === "loading" && (
                    <button className="btn btn-secondary btn-sm flex-fill" disabled>
                      Adding...
                    </button>
                  )}

                  {status === "added" && (
                    <button className="btn btn-outline-success btn-sm flex-fill" disabled>
                      ✅ Added
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  </div>
)}

                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="d-flex align-items-start mb-4">
            <div className="bg-light rounded-circle p-2 me-2">
              <span className="text-primary">🐸</span>
            </div>
            <div className="bg-light p-3 rounded-4">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-top bg-light d-flex gap-2 align-items-center">
       
        <input
          type="text"
          className="form-control border-0 shadow-sm"
          placeholder="Ask me to find products..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ borderRadius: "25px" }}
        />
        <motion.button
          className="btn btn-primary px-4"
          style={{ borderRadius: "25px" }}
          onClick={handleSendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!inputMessage.trim() && !imageFile}
        >
          🚀
        </motion.button>
      </div>

      <style>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #007bff;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0.0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default AIChat;
