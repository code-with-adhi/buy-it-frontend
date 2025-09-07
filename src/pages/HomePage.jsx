import React, { useState, useEffect, useContext } from "react";
import API from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useProducts } from "../context/ProductContext.jsx";

function HomePage() {
  const { products, loading } = useProducts(); // Get loading state from context
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(20000);
  const [activeCardId, setActiveCardId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let tempProducts = [...products];
    if (selectedCategory) {
      tempProducts = tempProducts.filter(
        (p) => p.category === selectedCategory
      );
    }
    tempProducts = tempProducts.filter((p) => p.price <= maxPrice);
    setFilteredProducts(tempProducts);
  }, [selectedCategory, maxPrice, products]);

  const handleAddToCartClick = (productId) => {
    setQuantity(1);
    setActiveCardId(productId);
  };

  const handleConfirmAddToCart = async (productId) => {
    if (!token) {
      showNotification("Please log in to add items to your cart.", "error");
      return;
    }
    try {
      await API.post(
        "/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification(`${quantity} item(s) added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showNotification("Failed to add product to cart.", "error");
    } finally {
      setActiveCardId(null);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleImageError = (e) => {
    e.target.src = "https://placehold.co/300x200?text=No+Image";
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h1>Our Products</h1>

      {/* Modern Filters */}
      <div className="modern-filters">
        <div className="filter-item">
          <label className="filter-label">CATEGORY:</label>
          <div className="select-wrapper">
            <select
              className="custom-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="select-arrow">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="filter-item">
          <label className="filter-label">
            MAX PRICE: ₹{maxPrice.toLocaleString()}
          </label>
          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-slider"
            />
            <div className="slider-track">
              <div
                className="slider-fill"
                style={{ width: `${(maxPrice / 20000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
                onError={handleImageError}
              />
              <div className="product-details">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p className="price">₹{product.price}</p>
              </div>
              <div className="cart-action-container">
                <button
                  className={`add-to-cart-btn ${
                    activeCardId === product._id ? "inactive" : ""
                  }`}
                  onClick={() => handleAddToCartClick(product._id)}
                >
                  Add to Cart
                </button>
                <div
                  className={`quantity-selector ${
                    activeCardId === product._id ? "active" : ""
                  }`}
                >
                  <button onClick={decrementQuantity} className="quantity-btn">
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button onClick={incrementQuantity} className="quantity-btn">
                    +
                  </button>
                  <button
                    onClick={() => handleConfirmAddToCart(product._id)}
                    className="confirm-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products-message">
            No products match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
