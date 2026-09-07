// ========================================
// BASE URL
// ========================================

export const BASE_URL = "http://localhost:5000/api";

// ========================================
// SIGNUP
// ========================================

export const signupUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};

// ========================================
// LOGIN
// ========================================

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// ========================================
// GET ALL PRODUCTS
// ========================================

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/products`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch products");
  }

  return data.products;
};

// ========================================
// GET SINGLE PRODUCT
// ========================================

export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch product");
  }

  return data.product;
};

// ========================================
// CREATE PRODUCT
// ========================================

export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data.product;
};

// ========================================
// UPDATE PRODUCT
// ========================================

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data.product;
};

// ========================================
// DELETE PRODUCT
// ========================================

export const deleteProduct = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};