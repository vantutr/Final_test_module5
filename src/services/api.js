import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = () => apiClient.get("/products");
export const getProductById = (id) => apiClient.get(`/products/${id}`);
export const createProduct = (product) => apiClient.post("/products", product);
export const updateProduct = (id, product) =>
  apiClient.put(`/products/${id}`, product);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);
export const getCategories = () => apiClient.get("/categories");
