
export const BASE_URL = "http://localhost:5000/api";

// ============================================================
// SHARED HELPERS
// ============================================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  // FormData must use the browser-generated multipart boundary.
  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new Error("Request failed.");
    }
    return null;
  }

  const responseText = await response.text();
  let data = null;

  if (responseText.trim()) {
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error("API returned a non-JSON response:", {
        url: `${BASE_URL}${path}`,
        status: response.status,
        response: responseText.slice(0, 300),
      });

      throw new Error(
        `The server returned an unexpected response (${response.status}). Check the API URL and backend route.`
      );
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        data?.message || "Your session has expired. Please log in again."
      );
    }

    throw new Error(
      data?.message || `Request failed (${response.status}).`
    );
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

export const updateProductInventory = (productId, sizeInventory) =>
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

// Backwards-compatible alias.
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

export const updateShippingDetails = async (id, shippingData) => {
  return request(
    `/orders/${id}/shipping`,
    jsonOptions("PATCH", shippingData)
  );
};

// ============================================================
// ANNOUNCEMENTS
// ============================================================

// Public storefront: return active announcements.
export const getActiveAnnouncements = async () => {
  const data = await request("/announcements/active");

  if (data?.announcement) {
    return [data.announcement];
  }

  if (Array.isArray(data?.announcements)) {
    return data.announcements;
  }

  return [];
};

// Compatibility helper for components expecting one announcement.
export const getPublicAnnouncement = async () => {
  const announcements = await getActiveAnnouncements();
  return announcements[0] ?? null;
};

// Admin: list announcements.
export const getAnnouncements = async () => {
  const data = await request("/announcements");
  return Array.isArray(data?.announcements)
    ? data.announcements
    : [];
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

// ============================================================
// COUPON MANAGEMENT
// ============================================================

// Public checkout: validate coupon.
export const validateCoupon = async ({ code, subtotal, email }) => {
  const data = await request(
    "/coupons/validate",
    jsonOptions("POST", { code, subtotal, email })
  );

  return data?.coupon;
};

// Admin: get coupons.
export const getAdminCoupons = async () => {
  const data = await request("/coupons");
  return data?.coupons || [];
};

// Admin: create coupon.
export const createCoupon = async (couponData) => {
  const data = await request(
    "/coupons",
    jsonOptions("POST", couponData)
  );

  return data?.coupon;
};

// Admin: update coupon.
export const updateCoupon = async (id, couponData) => {
  const data = await request(
    `/coupons/${id}`,
    jsonOptions("PUT", couponData)
  );

  return data?.coupon;
};

// Admin: enable or disable coupon.
export const toggleCoupon = async (id) => {
  const data = await request(`/coupons/${id}/toggle`, {
    method: "PATCH",
  });

  return data?.coupon;
};

// Admin: delete coupon.
export const deleteCoupon = (id) =>
  request(`/coupons/${id}`, { method: "DELETE" });

// ============================================================
// CUSTOMER REVIEWS
// ============================================================

// Public: retrieve approved reviews.
// Confirm that the backend GET /api/reviews returns { reviews: [...] }.
export const getReviews = async () => {
  const data = await request("/reviews");
  return Array.isArray(data?.reviews) ? data.reviews : [];
};

// Public: submit a review with optional photos.
// reviewData must be FormData when submitting this form.
export const submitReview = async (reviewData) => {
  if (!(reviewData instanceof FormData)) {
    throw new Error(
      "Review submission must use FormData so photos can be uploaded."
    );
  }

  return request("/reviews", {
    method: "POST",
    body: reviewData,
  });
};

// ============================================================
// ADMIN REVIEW MANAGEMENT
// ============================================================

// Admin: retrieve customer reviews.
export const getAdminReviews = async () => {
  const data = await request("/reviews");

  return Array.isArray(data?.reviews) ? data.reviews : [];
};

// Admin: delete an inappropriate review.
export const deleteReview = (reviewId) => {
  if (!reviewId) {
    throw new Error("A valid review ID is required.");
  }

  return request(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};