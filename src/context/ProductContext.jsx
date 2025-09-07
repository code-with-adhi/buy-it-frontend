import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api.js";

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before the API call
    try {
      const response = await API.get(
        `/products?timestamp=${new Date().getTime()}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, refetchProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
