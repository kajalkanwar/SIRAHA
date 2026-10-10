
export const BASE_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data =
    response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
};

const jsonOptions = (method, body) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

// ============================================================
// AUTH
// ============================================================

export const signupUser = (userData) =>
  request("/auth/signup", jsonOptions("POST", userData));

export const loginUser = (userData) =>
  request("/auth/login", jsonOptions("POST", userData));

export const sendOtp = (payload) =>
  request("/auth/send-otp", jsonOptions("POST", payload));

export const verifyOtp = (payload) =>
  request("/auth/verify-otp", jsonOptions("POST", payload));

// ============================================================
// PRODUCTS
// ============================================================

export const getProducts = async () => {
  const data = await request("/products");
  return Array.isArray(data) ? data : data?.products || [];
};

export const getProductById = async (id) => {
  const data = await request(`/products/${id}`);
  return data?.product ?? data;
};

export const uploadProductImages = async (files) => {
  const fileArray = Array.from(files || []);

  if (!fileArray.length) {
    throw new Error("Please select at least one image.");
  }

  const formData = new FormData();
  fileArray.forEach((file) => formData.append("images", file));

  const data = await request("/products/upload-images", {
    method: "POST",
    body: formData,
  });

  return data?.images || [];
};

export const createProduct = async (productData) => {
  const data = await request(
    "/products",
    jsonOptions("POST", productData)
  );
  return data?.product ?? data;
};

export const updateProduct = async (id, productData) => {
  const data = await request(
    `/products/${id}`,
    jsonOptions("PUT", productData)
  );
  return data?.product ?? data;
};

export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: "DELETE" });

// ============================================================
// CATEGORIES
// ============================================================

export const getCategories = async (includeInactive = false) => {
  const query = includeInactive ? "?all=true" : "";
  const data = await request(`/categories${query}`);

  return Array.isArray(data) ? data : data?.categories || [];
};

export const createCategory = async (categoryData) => {
  const data = await request(
    "/categories",
    jsonOptions("POST", categoryData)
  );
  return data?.category ?? data;
};

export const updateCategory = async (id, categoryData) => {
  const data = await request(
    `/categories/${id}`,
    jsonOptions("PUT", categoryData)
  );
  return data?.category ?? data;
};

export const deleteCategory = (id) =>
  request(`/categories/${id}`, { method: "DELETE" });

// ============================================================
// INVENTORY
// ============================================================

export const getInventory = async () => {
  const data = await request("/inventory");
  return Array.isArray(data) ? data : data?.products || [];
};

export const updateProductInventory = async (
  productId,
  sizeInventory
) =>
  request(
    `/inventory/${productId}`,
    jsonOptions("PUT", { sizeInventory })
  );

// ============================================================
// ORDERS
// ============================================================

export const createOrder = (orderData) =>
  request("/orders", jsonOptions("POST", orderData));

export const getAdminOrders = async () => {
  const data = await request("/orders");
  return Array.isArray(data) ? data : data?.orders || [];
};

export const getOrders = getAdminOrders;

export const getOrderById = async (id) => {
  const data = await request(`/orders/${id}`);
  return data?.order ?? data;
};

export const updateOrderStatus = (id, orderStatus) =>
  request(
    `/orders/${id}/status`,
    jsonOptions("PUT", { orderStatus })
  );

// ============================================================
// ANNOUNCEMENTS
// ============================================================

export const getAnnouncements = async () => {
  const data = await request("/announcements");
  return data?.announcements || data || [];
};

export const createAnnouncement = async (announcementData) => {
  const data = await request(
    "/announcements",
    jsonOptions("POST", announcementData)
  );
  return data?.announcement ?? data;
};

export const updateAnnouncement = async (id, announcementData) => {
  const data = await request(
    `/announcements/${id}`,
    jsonOptions("PUT", announcementData)
  );
  return data?.announcement ?? data;
};

export const deleteAnnouncement = (id) =>
  request(`/announcements/${id}`, { method: "DELETE" });

// ============================================================
// RAZORPAY
// ============================================================

export const createRazorpayOrder = (amount) =>
  request(
    "/payments/create-order",
    jsonOptions("POST", { amount })
  );

export const verifyRazorpayPayment = (paymentData) =>
  request("/payments/verify", jsonOptions("POST", paymentData));
