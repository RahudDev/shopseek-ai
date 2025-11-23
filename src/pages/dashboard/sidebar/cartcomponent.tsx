import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../../../Auth/Supabase";
import { getUserUuid } from "../../../function/getclientuuid";

interface ProductInCart {
  id?: string | number;
  name: string;
  price: string;
  store: string;
  image: string;
  link: string;
}

const CartComponent: React.FC = () => {
  const [cartItems, setCartItems] = useState<ProductInCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartRowId, setCartRowId] = useState<number | null>(null); // row id in DB

  // Fetch cart from Supabase
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const uuid = await getUserUuid();
        if (!uuid) {
          alert("⚠️ You must be logged in to see your cart");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("shopseek_client_cart")
          .select("id, list_cart")
          .eq("user_uuid", uuid)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching cart:", error);
        } else if (data) {
          setCartItems(data.list_cart || []);
          setCartRowId(data.id);
        }
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemove = async (index: number) => {
    if (!cartRowId) return;

    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);

    const { error } = await supabase
      .from("shopseek_client_cart")
      .update({ list_cart: updatedCart })
      .eq("id", cartRowId);

    if (error) {
      console.error("Failed to remove item:", error);
    } else {
      setCartItems(updatedCart);
    }
  };

  if (loading) {
    return <div className="p-4">Loading cart items...</div>;
  }

  return (
    <div className="p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-primary mb-0">My Cart</h4>
        <span className="badge bg-primary">{cartItems.length} items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-sm text-center p-4">
          <p className="text-muted mb-0">Your cart is empty.</p>
        </div>
      ) : (
        cartItems.map((item, index) => (
          <motion.div
            key={index}
            className="card mb-3 border-0 shadow-sm"
            whileHover={{ scale: 1.01 }}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-2 text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-6">
                  <h6 className="mb-1">{item.name}</h6>
                  <small className="text-muted">from {item.store}</small>
                </div>
                <div className="col-2 text-center">
                  <span className="fw-bold text-success">{item.price}</span>
                </div>
                <div className="col-2 text-center d-flex flex-column gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    Go to Store
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CartComponent;
