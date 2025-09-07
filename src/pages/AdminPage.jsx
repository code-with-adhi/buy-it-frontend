import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import { useProducts } from "../context/ProductContext.jsx";

function AdminPage() {
  const { products, refetchProducts } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const { token } = useContext(AuthContext);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = products.find((p) => p._id === selectedProductId);
      if (selectedProduct) {
        setFormData(selectedProduct);
      }
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
      });
    }
  }, [selectedProductId, products]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showNotification("Authorization denied.", "error");
      return;
    }

    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("file", imageFile);
      uploadData.append("upload_preset", "cevrzf7f"); 

      try {
        showNotification("Uploading image...");
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dyzdtdgp9/image/upload`,
          uploadData
        );
        finalImageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload error:", error);
        showNotification(
          "Image upload failed. Check Cloudinary preset.",
          "error"
        );
        return;
      }
    }

    const productData = { ...formData, imageUrl: finalImageUrl };
    const apiConfig = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (selectedProductId) {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProductId}`,
          productData,
          apiConfig
        );
        showNotification("Product updated successfully!");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          productData,
          apiConfig
        );
        showNotification("Product created successfully!");
      }

      refetchProducts();
      setSelectedProductId("");
      setImageFile(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      showNotification("Operation failed.", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This cannot be undone."
      )
    ) {
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${selectedProductId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showNotification("Product deleted successfully!", "error");
      refetchProducts();
      setSelectedProductId("");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product.", "error");
    }
  };

  return (
    <div className="form-container admin-page">
      <h1>Manage Products</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group form-span-2">
          <label htmlFor="product-select">Select Product to Update:</label>
          <select
            id="product-select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Create New Product --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-span-2">
          <label htmlFor="name">Product Name:</label>
          <input
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="e.g., Premium Wireless Headphones"
            required
          />
        </div>

        <div className="form-group form-span-2">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Detailed product description..."
            required
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹):</label>
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            placeholder="e.g., 7999"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <input
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            placeholder="e.g., Electronics"
            required
          />
        </div>

        <div className="form-group form-span-2">
          <label htmlFor="imageUrl">Image URL (Current or Fallback):</label>
          <input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ""}
            onChange={handleChange}
            placeholder="Paste an image URL or upload a file below"
          />
        </div>

        <div className="form-group form-span-2">
          <label htmlFor="image">Upload New Image:</label>
          <input
            id="image"
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="admin-buttons-container form-span-2">
          <button type="submit" className="admin-submit-btn">
            {selectedProductId ? "Update Product" : "Create Product"}
          </button>
          {selectedProductId && (
            <button
              type="button"
              onClick={handleDelete}
              className="admin-delete-btn"
            >
              Delete Product
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminPage;
