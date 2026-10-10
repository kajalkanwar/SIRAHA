import { useEffect, useState } from "react";
import { getAdminOrders } from "../../constants/api";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminOrders();

        setOrders(data);
      } catch (err) {
        console.error("Fetch admin orders error:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-semibold">Orders</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EC] p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[#0E5B3B]">
          Customer Orders
        </h1>

        <p className="mt-1 text-gray-600">
          View and manage all customer orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-600">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium text-gray-800">
                    {order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Order Status</p>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="font-medium">
                    {order.customerName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {order.customerEmail || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {order.customerPhone || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <p className="mb-2 text-sm text-gray-500">
                  Ordered Items
                </p>

                <div className="space-y-2">
                  {order.items?.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {item.name || item.product?.description || "Product"}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity || 1}
                        </p>
                      </div>

                      <p className="font-medium">
                        ₹{item.price || 0}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-between gap-3 border-t pt-4">
                <p>
                  <span className="text-gray-500">Payment:</span>{" "}
                  <span className="font-medium">
                    {order.paymentMethod || "COD"}
                  </span>
                </p>

                <p className="text-lg font-semibold text-[#0E5B3B]">
                  Total: ₹{order.totalAmount || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;