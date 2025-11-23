import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../../Auth/Supabase";
import "bootstrap/dist/css/bootstrap.min.css";
import { handleAddToCart } from "../../../components/cart";
import { getUserUuid } from "../../../function/getclientuuid";


interface Product {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: string;
  store: string;
  image: string;
  link: string;
  id: string;
}

interface SearchHistoryItem {
  id: number;
  query: string;
  platform: string;
  results: Product[];
  created_at: string;
}

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const HistoryComponent: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const cookieValue = getCookie("shop_seek_client");
        if (!cookieValue) return;

        let userEmail = "";
        try {
          const parsed = JSON.parse(cookieValue);
          userEmail = parsed.email;
        } catch {
          userEmail = cookieValue;
        }

        if (!userEmail) return;

        const { data: userData, error: userError } = await supabase
          .from("shopseek_user")
          .select("uuid")
          .eq("email", userEmail)
          .maybeSingle();

        if (userError || !userData?.uuid) {
          console.error("Cannot find user UUID:", userError);
          return;
        }

        const { data: historyData, error: historyError } = await supabase
          .from("shopseek_client_history")
          .select("*")
          .eq("user_uuid", userData.uuid)
          .order("created_at", { ascending: false });

        if (historyError) {
          console.error("Error fetching history:", historyError);
        } else {
          setHistoryItems(historyData || []);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);


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
  

  if (loading) {
    return <div className="p-4">Loading search history...</div>;
  }

  // Show at least one default card if no history
  const displayItems = historyItems.length ? historyItems : [{
    id: 0,
    query: "No search history found",
    platform: "-",
    results: [],
    created_at: new Date().toISOString()
  }];

  return (
     <div className="p-4" style={{ maxHeight: "100vh", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-primary mb-0">Search History</h4>
        <button className="btn btn-outline-danger btn-sm">Clear All</button>
      </div>

      {displayItems.map((item) => (
        <motion.div
          key={item.id}
          className="card mb-3 border-0 shadow-sm"
          whileHover={{ scale: item.id ? 1.01 : 1 }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className={`mb-1 ${item.id ? "text-primary" : "text-muted"}`}>
                  {item.query}
                </h6>
                {item.id && (
                  <small className="text-muted">
                    {item.platform} • {new Date(item.created_at).toLocaleString()} • {item.results?.length || 0} products
                  </small>
                )}
              </div>
            </div>

           {/* Products as sub-cards */}
<div className="row g-2 mt-2">
  {item.results && item.results.length > 0 ? (
    item.results.map((product, index) => {
      const productKey = product.id || product.name; // Unique key for cart status
      const status = cartStatus[productKey] || "idle"; // Track add-to-cart status

      return (
        <div key={index} className="col-md-4">
          <motion.div
            className="card border-0 shadow-sm h-100 d-flex flex-column"
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
              <h6 className="card-title mb-1">{product.name}</h6>

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

              {/* Actions Row */}
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
    })
  ) : !item.id ? (
    <div className="col-12">
      <div className="card h-100 border-0 shadow-sm text-center p-4">
        <p className="text-muted mb-0">You have no search history yet.</p>
      </div>
    </div>
  ) : (
    <p className="text-muted">No products found for this search.</p>
  )}
</div>

          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HistoryComponent;
