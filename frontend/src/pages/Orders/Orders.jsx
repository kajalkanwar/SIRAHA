
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiChevronDown,
  FiClock,
  FiEye,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiTruck,
  FiX,
  FiSave,
} from "react-icons/fi";

import {
  getAdminOrders,
  updateOrderStatus,
  updateShippingDetails,
} from "../../constants/api";

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-800 border-blue-200",
  PROCESSING: "bg-violet-50 text-violet-800 border-violet-200",
  SHIPPED: "bg-indigo-50 text-indigo-800 border-indigo-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusLabel = (status) =>
  String(status || "PENDING")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function StatusBadge({ status }) {
  const normalized = String(status || "PENDING").toUpperCase();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-medium tracking-wide ${
        STATUS_STYLES[normalized] ||
        "border-[#E5DDD8] bg-[#FFFFFF] text-[#4B1F1B]"
      }`}
    >
      {getStatusLabel(normalized)}
    </span>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
  savingId,
  onShippingSave,
  shippingSavingId,
}) {
  const [shippingForm, setShippingForm] = useState(() => {
    const expectedDate = order?.expectedDelivery
      ? new Date(order.expectedDelivery)
      : null;

    const formattedExpectedDate =
      expectedDate && !Number.isNaN(expectedDate.getTime())
        ? [
            expectedDate.getFullYear(),
            String(expectedDate.getMonth() + 1).padStart(2, "0"),
            String(expectedDate.getDate()).padStart(2, "0"),
          ].join("-")
        : "";

    return {
      courierPartner: order?.courierPartner || "",
      trackingNumber: order?.trackingNumber || "",
      trackingUrl: order?.trackingUrl || "",
      expectedDelivery: formattedExpectedDate,
    };
  });

  const isSavingShipping = shippingSavingId === order?._id;

  const handleShippingSubmit = async (event) => {
    event.preventDefault();

    await onShippingSave(order, {
      ...shippingForm,
      expectedDelivery: shippingForm.expectedDelivery || null,
    });
  };

  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];
  const isSaving = savingId === order._id;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#21120F]/45 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#E5DDD8] bg-[#FFFFFF] shadow-[0_25px_80px_rgba(33,18,15,0.25)]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E5DDD8] bg-[#FFFFFF]/95 px-5 py-5 backdrop-blur sm:px-7">
          <div>
            <p className="font-['Poppins'] text-[9px] uppercase tracking-[2px] text-[#A98243]">
              Order details
            </p>
            <h2
              id="order-details-title"
              className="mt-1 break-all font-['Cormorant_Garamond'] text-3xl text-[#351411]"
            >
              {order.orderNumber || order._id}
            </h2>
            <p className="mt-1 text-xs text-[#6B5651]">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5DDD8] text-[#4B1F1B] transition hover:border-[#C8A15A] hover:bg-[#FFFFFF]"
          >
            <FiX size={17} />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#F1ECE9] p-4">
              <p className="text-[9px] font-medium uppercase tracking-[1.5px] text-[#A98243]">
                Customer
              </p>
              <p className="mt-2 text-sm font-medium text-[#351411]">
                {order.customerName || "—"}
              </p>
              <p className="mt-1 break-all text-xs text-[#6B5651]">
                {order.email || "—"}
              </p>
              <p className="mt-1 text-xs text-[#6B5651]">
                {order.phone || "—"}
              </p>
            </div>

            <div className="rounded-lg border border-[#F1ECE9] p-4">
              <p className="text-[9px] font-medium uppercase tracking-[1.5px] text-[#A98243]">
                Delivery address
              </p>
              <p className="mt-2 text-sm text-[#351411]">
                {order.address || "—"}
              </p>
              <p className="mt-1 text-xs text-[#6B5651]">
                {[order.city, order.state, order.pincode]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#F1ECE9] p-4">
              <p className="text-[9px] uppercase tracking-[1.5px] text-[#A98243]">
                Payment method
              </p>
              <p className="mt-2 text-sm font-medium text-[#351411]">
                {order.paymentMethod || "—"}
              </p>
              <p className="mt-2 text-xs text-[#6B5651]">
                Payment status:{" "}
                <span className="font-medium text-[#351411]">
                  {getStatusLabel(order.paymentStatus)}
                </span>
              </p>
              {order.razorpayPaymentId && (
                <p className="mt-2 break-all text-[10px] text-[#6B5651]">
                  Payment ID: {order.razorpayPaymentId}
                </p>
              )}
            </div>

            <div className="rounded-lg border border-[#F1ECE9] p-4">
              <p className="text-[9px] uppercase tracking-[1.5px] text-[#A98243]">
                Order status
              </p>
              <div className="mt-3">
                <StatusBadge status={order.orderStatus} />
              </div>

              <label
                htmlFor="order-status-update"
                className="mt-4 block text-xs text-[#6B5651]"
              >
                Update status
              </label>

              <div className="relative mt-2">
                <select
                  id="order-status-update"
                  value={order.orderStatus || "PENDING"}
                  disabled={
                    isSaving || order.orderStatus === "CANCELLED"
                  }
                  onChange={(event) =>
                    onStatusChange(order, event.target.value)
                  }
                  className="w-full appearance-none rounded-lg border border-[#E5DDD8] bg-white px-3 py-2.5 pr-9 text-xs text-[#351411] outline-none transition focus:border-[#A98243] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A98243]"
                  size={14}
                />
              </div>

              {isSaving && (
                <p className="mt-2 text-[10px] text-[#A98243]">
                  Saving status…
                </p>
              )}

              {order.orderStatus === "CANCELLED" && (
                <p className="mt-2 text-[10px] text-[#6B5651]">
                  Cancelled orders cannot be reopened here.
                </p>
              )}
            </div>
          </div>
          <form
            onSubmit={handleShippingSubmit}
            className="rounded-xl border border-[#E5DDD8] bg-[#FFFFFF] p-4 sm:p-5"
          >
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] text-[#8E6738]">
                <FiTruck size={18} />
              </div>
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#351411]">
                  Shipping Details
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#6B5651]">
                  Add the courier and tracking information for this order.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[#4B1F1B]">
                  Courier Partner
                </span>
                <input
                  type="text"
                  list="sirraha-courier-options"
                  value={shippingForm.courierPartner}
                  onChange={(event) =>
                    setShippingForm((current) => ({
                      ...current,
                      courierPartner: event.target.value,
                    }))
                  }
                  placeholder="e.g. Delhivery"
                  className="w-full rounded-lg border border-[#E5DDD8] bg-white px-3 py-2.5 text-sm text-[#351411] outline-none focus:border-[#A98243]"
                />
                <datalist id="sirraha-courier-options">
                  <option value="Delhivery" />
                  <option value="Blue Dart" />
                  <option value="India Post" />
                  <option value="DTDC" />
                  <option value="Other" />
                </datalist>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-[#4B1F1B]">
                  Tracking / AWB Number
                </span>
                <input
                  type="text"
                  value={shippingForm.trackingNumber}
                  onChange={(event) =>
                    setShippingForm((current) => ({
                      ...current,
                      trackingNumber: event.target.value,
                    }))
                  }
                  placeholder="Enter shipment number"
                  className="w-full rounded-lg border border-[#E5DDD8] bg-white px-3 py-2.5 text-sm text-[#351411] outline-none focus:border-[#A98243]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-[#4B1F1B]">
                  Tracking URL
                </span>
                <input
                  type="url"
                  value={shippingForm.trackingUrl}
                  onChange={(event) =>
                    setShippingForm((current) => ({
                      ...current,
                      trackingUrl: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-[#E5DDD8] bg-white px-3 py-2.5 text-sm text-[#351411] outline-none focus:border-[#A98243]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium text-[#4B1F1B]">
                  Expected Delivery Date
                </span>
                <input
                  type="date"
                  value={shippingForm.expectedDelivery}
                  onChange={(event) =>
                    setShippingForm((current) => ({
                      ...current,
                      expectedDelivery: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#E5DDD8] bg-white px-3 py-2.5 text-sm text-[#351411] outline-none focus:border-[#A98243]"
                />
              </label>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={isSavingShipping}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#4B1F1B] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#351411] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSave size={14} />
                {isSavingShipping
                  ? "Saving shipping…"
                  : "Save Shipping Details"}
              </button>
            </div>
          </form>

          <div>
            <h3 className="mb-3 font-['Cormorant_Garamond'] text-2xl text-[#351411]">
              Items ordered
            </h3>

            <div className="overflow-x-auto rounded-lg border border-[#F1ECE9]">
              <table className="w-full min-w-[450px] text-left">
                <thead className="bg-[#FFFFFF]">
                  <tr className="text-[9px] uppercase tracking-wider text-[#4B1F1B]">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Size</th>
                    <th className="px-4 py-3 text-center font-medium">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Price
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={`${item.product || item.name}-${index}`}
                      className="border-t border-[#F1ECE9] text-xs text-[#4B1F1B]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name || "Product"}
                              className="h-12 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-10 items-center justify-center rounded bg-[#FFFFFF]">
                              <FiPackage size={16} />
                            </div>
                          )}

                          <span className="min-w-0 font-medium">
                            {item.name || "Product"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">{item.size || "—"}</td>

                      <td className="px-4 py-3 text-center">
                        {item.quantity || 0}
                      </td>

                      <td className="px-4 py-3 text-right">
                        {formatCurrency(
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ml-auto max-w-sm space-y-2 border-t border-[#E5DDD8] pt-4 text-xs">
            <div className="flex justify-between gap-4 text-[#6B5651]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between gap-4 text-[#6B5651]">
              <span>Shipping</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>

            <div className="flex justify-between gap-4 text-[#6B5651]">
              <span>Discount</span>
              <span>−{formatCurrency(order.discount)}</span>
            </div>

            <div className="flex justify-between gap-4 border-t border-[#F1ECE9] pt-3 text-sm font-semibold text-[#351411]">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [savingId, setSavingId] = useState("");
  const [shippingSavingId, setShippingSavingId] = useState("");

  const loadOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const data = await getAdminOrders();
      const safeOrders = Array.isArray(data) ? data : [];

      setOrders(safeOrders);

      setSelectedOrder((current) => {
        if (!current) return null;
        return safeOrders.find((item) => item._id === current._id) || null;
      });
    } catch (loadError) {
      setError(loadError.message || "Unable to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const status = String(order.orderStatus || "PENDING").toUpperCase();

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const searchable = [
        order.orderNumber,
        order._id,
        order.customerName,
        order.email,
        order.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.orderStatus !== "CANCELLED")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return {
      total: orders.length,
      pending: orders.filter(
        (order) => order.orderStatus === "PENDING"
      ).length,
      processing: orders.filter((order) =>
        ["CONFIRMED", "PROCESSING"].includes(order.orderStatus)
      ).length,
      delivered: orders.filter(
        (order) => order.orderStatus === "DELIVERED"
      ).length,
      revenue: totalRevenue,
    };
  }, [orders]);

  const handleStatusChange = async (order, nextStatus) => {
    if (
      !order?._id ||
      !nextStatus ||
      nextStatus === order.orderStatus
    ) {
      return;
    }

    const previousStatus = order.orderStatus;

    setSavingId(order._id);
    setError("");
    setNotice("");

    try {
      const response = await updateOrderStatus(order._id, nextStatus);
      const updatedOrder = response?.order || response;

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id
            ? { ...item, ...updatedOrder, orderStatus: nextStatus }
            : item
        )
      );

      setSelectedOrder((current) =>
        current?._id === order._id
          ? { ...current, ...updatedOrder, orderStatus: nextStatus }
          : current
      );

      setNotice(
        `Order status updated to ${getStatusLabel(nextStatus)}.`
      );
    } catch (updateError) {
      setError(
        updateError.message || "Unable to update order status."
      );

      setSelectedOrder((current) =>
        current?._id === order._id
          ? { ...current, orderStatus: previousStatus }
          : current
      );
    } finally {
      setSavingId("");
    }
  };

  const handleShippingSave = async (order, shippingData) => {
    if (!order?._id) return;

    setShippingSavingId(order._id);
    setError("");
    setNotice("");

    try {
      const response = await updateShippingDetails(
        order._id,
        shippingData
      );

      const updatedOrder = response?.order || response;

      if (!updatedOrder?._id) {
      throw new Error(
        "The server did not confirm the updated order. Check the API response."
      );
    }

      setOrders((current) =>
        current.map((item) =>
          item._id === order._id
            ? { ...item, ...updatedOrder }
            : item
        )
      );

      setSelectedOrder((current) =>
        current?._id === order._id
          ? { ...current, ...updatedOrder }
          : current
      );

      setNotice("Shipping details saved successfully.");
    } catch (saveError) {
      setError(
        saveError.message || "Unable to save shipping details."
      );
    } finally {
      setShippingSavingId("");
    }
  };

  return (
    <main className="min-h-full bg-[#FFFFFF] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-['Poppins'] text-[9px] font-medium uppercase tracking-[2.5px] text-[#A98243]">
              Sirraha Administration
            </p>

            <h1 className="mt-2 font-['Cormorant_Garamond'] text-[42px] leading-none text-[#351411] sm:text-[48px]">
              Orders
            </h1>

            <p className="mt-3 text-sm text-[#6B5651]">
              Review customer orders and manage fulfilment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(true)}
            disabled={refreshing}
            className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#4B1F1B] transition hover:border-[#C8A15A] hover:bg-[#FFFFFF] disabled:opacity-60 sm:self-auto"
          >
            <FiRefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start justify-between gap-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {notice && (
          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <FiCheck size={16} />
            {notice}
            <button
              type="button"
              className="ml-auto"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Total orders",
              value: stats.total,
              icon: FiPackage,
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: FiClock,
            },
            {
              label: "In progress",
              value: stats.processing,
              icon: FiTruck,
            },
            {
              label: "Delivered",
              value: stats.delivered,
              icon: FiCheck,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-[#F1ECE9] bg-[#FFFFFF] p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] uppercase tracking-[1px] text-[#6B5651]">
                    {stat.label}
                  </p>
                  <Icon size={17} className="text-[#A98243]" />
                </div>

                <p className="mt-3 font-['Cormorant_Garamond'] text-3xl text-[#351411]">
                  {loading ? "—" : stat.value}
                </p>
              </div>
            );
          })}
        </section>
                <section className="mt-7 overflow-hidden rounded-xl border border-[#F1ECE9] bg-[#FFFFFF]">
          <div className="flex flex-col gap-4 border-b border-[#F1ECE9] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#351411]">
                All orders
              </h2>

              <p className="mt-1 text-xs text-[#6B5651]">
                {loading
                  ? "Loading orders…"
                  : `${filteredOrders.length} of ${orders.length} orders`}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[520px]">
              <label className="relative block">
                <FiSearch
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A98243]"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search order or customer"
                  className="h-10 w-full rounded-lg border border-[#E5DDD8] bg-white pl-9 pr-3 text-xs text-[#351411] outline-none transition placeholder:text-[#9B8C7D] focus:border-[#A98243]"
                />
              </label>

              <label className="relative block">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="h-10 w-full appearance-none rounded-lg border border-[#E5DDD8] bg-white px-3 pr-9 text-xs text-[#351411] outline-none transition focus:border-[#A98243]"
                >
                  <option value="ALL">All statuses</option>

                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>

                <FiChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A98243]"
                />
              </label>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#6B5651]">
              <FiRefreshCw className="animate-spin text-[#A98243]" />
              Loading orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF] text-[#A98243]">
                <FiPackage size={21} />
              </div>

              <h3 className="mt-4 font-['Cormorant_Garamond'] text-2xl text-[#351411]">
                No orders found
              </h3>

              <p className="mt-2 max-w-sm text-xs leading-5 text-[#6B5651]">
                {orders.length
                  ? "Try changing your search or status filter."
                  : "New customer orders will appear here when they are placed."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#FFFFFF]">
                  <tr className="text-[9px] uppercase tracking-[1.3px] text-[#6B5651]">
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Payment</th>
                    <th className="px-5 py-4 font-medium">Total</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-[#F0E9DE] transition-colors hover:bg-[#FCFAF5]"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-[150px] truncate text-xs font-medium text-[#351411]">
                          {order.orderNumber || order._id}
                        </p>

                        <p className="mt-1 text-[10px] text-[#918477]">
                          {order.items?.length || 0} item(s)
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-[#351411]">
                          {order.customerName || "—"}
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-[10px] text-[#918477]">
                          {order.email || "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-[#6B5651]">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-[#351411]">
                          {order.paymentMethod || "—"}
                        </p>

                        <p className="mt-1 text-[10px] text-[#6B5651]">
                          {getStatusLabel(order.paymentStatus)}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-[#351411]">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          aria-label={`View order ${
                            order.orderNumber || order._id
                          }`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5DDD8] text-[#4B1F1B] transition hover:border-[#C8A15A] hover:bg-[#FFFFFF]"
                        >
                          <FiEye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {!loading && orders.length > 0 && (
          <p className="mt-4 text-right text-[10px] text-[#918477]">
            Revenue shown in order totals:{" "}
            <span className="font-medium text-[#4B1F1B]">
              {formatCurrency(stats.revenue)}
            </span>
          </p>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          key={selectedOrder._id}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          savingId={savingId}
          onShippingSave={handleShippingSave}
          shippingSavingId={shippingSavingId}
        />
      )}
    </main>
  );
}

export default Orders;