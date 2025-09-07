import React, { useState, useEffect, useContext } from "react";
import API from "../api.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [token]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    try {
      const response = await API.post(
        "/cart/update-quantity",
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
      showNotification("Failed to update quantity.", "error");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await API.post(
        "/cart/remove",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data);
      showNotification("Item removed from cart.", "error");
    } catch (error) {
      console.error("Error removing item:", error);
      showNotification("Failed to remove item.", "error");
    }
  };

  const handleClearCart = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove all items from your cart?"
      )
    ) {
      return;
    }
    try {
      const response = await API.delete("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
      showNotification("Cart has been cleared.", "error");
    } catch (error) {
      console.error("Error clearing cart:", error);
      showNotification("Failed to clear cart.", "error");
    }
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) return "0.00";
    return cartItems
      .reduce((total, item) => {
        if (item.productId && typeof item.productId.price === "number") {
          return total + item.productId.price * item.quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/120x120?text=No+Image";
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!token) {
    return <p>Please log in to see your cart.</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>

      {cartItems.length > 0 && (
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear All Items
        </button>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="back-to-shop-btn">
            Back to Shop
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items-list">
            {cartItems.map(
              (item) =>
                item &&
                item.productId && (
                  <div key={item.productId._id} className="cart-item">
                    <img
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="cart-item-image"
                      onError={handleImageError}
                    />
                    <div className="cart-item-details">
                      <h3>{item.productId.name}</h3>
                      <p className="price">
                        ₹{item.productId.price.toFixed(2)}
                      </p>
                      <div className="cart-item-actions">
                        <div className="quantity-selector-cart">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span className="quantity-display">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId._id)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>

            {/* --- NEW SUBTOTAL SECTION --- */}
            <div className="subtotal-list">
              {cartItems.map(
                (item) =>
                  item &&
                  item.productId && (
                    <div key={item.productId._id} className="subtotal-item">
                      <span>
                        {item.productId.name} (x{item.quantity})
                      </span>
                      <span>
                        ₹{(item.productId.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  )
              )}
            </div>

            <div className="total-price">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <Link to="/" className="back-to-shop-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
