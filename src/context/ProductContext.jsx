import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api.js";

const ProductContext = createContext();

export const useProducts = () => {
  return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      // Use the API instance and a relative path
      const response = await API.get(
        `/products?timestamp=${new Date().getTime()}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, refetchProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
