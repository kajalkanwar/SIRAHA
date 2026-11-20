
import { useCallback, useEffect, useState } from "react";
import {
  FiPlus,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiPower,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

import {
  getAdminCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
} from "../../constants/api";

const initialForm = {
  code: "",
  description: "",
  discountType: "PERCENT",
  discountValue: "10",
  minOrderAmount: "0",
  maxDiscountAmount: "",
  startDate: "",
  expiryDate: "",
  usageLimit: "",
  firstOrderOnly: false,
  isActive: true,
};

const inputClass =
  "mt-1 w-full rounded-xl border border-[#E4D9C9] bg-white px-3 py-3 text-sm text-[#351C19] outline-none transition focus:border-[#A98243] focus:ring-2 focus:ring-[#A98243]/10";

const labelClass =
  "block text-xs font-semibold uppercase tracking-[0.12em] text-[#78685B]";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const toLocalInput = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();

  return new Date(d.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 16);
};

// Calculate a coupon's status using a supplied timestamp.
// This function does not read the clock during rendering.
const calculateCouponStatus = (coupon, now) => {
  if (!coupon.isActive) return "Disabled";

  const startTime = new Date(coupon.startDate).getTime();
  const expiryTime = new Date(coupon.expiryDate).getTime();

  if (now < startTime) return "Scheduled";
  if (now > expiryTime) return "Expired";

  if (
    coupon.usageLimit != null &&
    Number(coupon.usedCount || 0) >= Number(coupon.usageLimit)
  ) {
    return "Limit reached";
  }

  return "Active";
};

function CouponManagement() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // The clock is stored in state, so React can update statuses periodically
  // without calling Date.now() directly during rendering.
  const [currentTime, setCurrentTime] = useState(() => new Date().getTime());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  const loadCoupons = useCallback(async () => {
    try {
      const data = await getAdminCoupons();

      setCoupons(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Start the asynchronous request after the effect runs.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const data = await getAdminCoupons();

        if (cancelled) return;

        setCoupons(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load coupons.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreate = () => {
    const now = new Date();

    setEditingId(null);
    setForm({
      ...initialForm,
      startDate: toLocalInput(now),
      expiryDate: toLocalInput(
        new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      ),
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingId(coupon._id);

    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount ?? 0),
      maxDiscountAmount:
        coupon.maxDiscountAmount == null
          ? ""
          : String(coupon.maxDiscountAmount),
      startDate: toLocalInput(coupon.startDate),
      expiryDate: toLocalInput(coupon.expiryDate),
      usageLimit:
        coupon.usageLimit == null ? "" : String(coupon.usageLimit),
      firstOrderOnly: Boolean(coupon.firstOrderOnly),
      isActive: Boolean(coupon.isActive),
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();


const normalizedCode = form.code.trim().toUpperCase();

if (!/^[A-Z0-9_-]{3,30}$/.test(normalizedCode)) {
  setError(
    "Coupon code must be 3–30 characters and contain only letters, numbers, underscores, or hyphens."
  );
  return;
}


    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        code: normalizedCode,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscountAmount:
          form.maxDiscountAmount === ""
            ? null
            : Number(form.maxDiscountAmount),
        usageLimit:
          form.usageLimit === "" ? null : Number(form.usageLimit),
        startDate: new Date(form.startDate).toISOString(),
        expiryDate: new Date(form.expiryDate).toISOString(),
      };

      if (editingId) {
        await updateCoupon(editingId, payload);
        setSuccess("Coupon updated successfully.");
      } else {
        await createCoupon(payload);
        setSuccess("Coupon created successfully.");
      }

      setModalOpen(false);
      setForm(initialForm);
      setEditingId(null);

      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      setError("");
      setSuccess("");

      await toggleCoupon(coupon._id);
      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to change coupon status.");
    }
  };

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `Delete coupon ${coupon.code}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteCoupon(coupon._id);
      setSuccess(`${coupon.code} was deleted.`);

      await loadCoupons();
    } catch (err) {
      setError(err.message || "Unable to delete coupon.");
    }
  };

  const getStatus = (coupon) =>
    calculateCouponStatus(coupon, currentTime);

  const statusClass = (status) => {
    if (status === "Active") {
      return "bg-green-50 text-green-800";
    }

    if (status === "Scheduled") {
      return "bg-blue-50 text-blue-800";
    }

    return "bg-[#F0E8DE] text-[#765C4A]";
  };

  const activeCount = coupons.filter(
    (coupon) => getStatus(coupon) === "Active"
  ).length;

  const expiredCount = coupons.filter(
    (coupon) => getStatus(coupon) === "Expired"
  ).length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 text-[#351C19] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#A98243]">
              Promotions &amp; offers
            </p>

            <h2 className="font-serif text-3xl text-[#351411] sm:text-4xl">
              Coupon Management
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#817265]">
              Create exclusive offers and manage discount campaigns
              for Sirraha customers.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadCoupons}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4D9C9] bg-white px-4 py-3 text-sm font-medium hover:bg-[#F4EDE2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4B1F1B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#351411]"
            >
              <FiPlus />
              Create coupon
            </button>
          </div>
        </div>

        {error && !modalOpen && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {success}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E9DFD1] bg-[#FFFFFF] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#817265]">Total coupons</p>
              <FiTag className="text-[#A98243]" size={19} />
            </div>

            <p className="mt-3 font-serif text-3xl">
              {coupons.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E9DFD1] bg-[#FFFFFF] p-5">
            <p className="text-sm text-[#817265]">Currently active</p>
            <p className="mt-3 font-serif text-3xl">{activeCount}</p>
          </div>

          <div className="rounded-2xl border border-[#E9DFD1] bg-[#FFFFFF] p-5">
            <p className="text-sm text-[#817265]">Expired coupons</p>
            <p className="mt-3 font-serif text-3xl">{expiredCount}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E9DFD1] bg-[#FFFFFF]">
          <div className="border-b border-[#E9DFD1] px-5 py-4">
            <h3 className="font-serif text-xl text-[#351411]">
              All coupons
            </h3>

            <p className="mt-1 text-xs text-[#817265]">
              Review discounts, campaign dates, and usage.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-[#817265]">
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-12 text-center">
              <FiTag
                className="mx-auto mb-3 text-[#A98243]"
                size={30}
              />

              <p className="font-medium">No coupons created yet</p>

              <p className="mt-1 text-sm text-[#817265]">
                Create your first discount campaign to get started.
              </p>

              <button
                type="button"
                onClick={openCreate}
                className="mt-5 rounded-xl bg-[#4B1F1B] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Create your first coupon
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#FFFFFF] text-[10px] uppercase tracking-[0.14em] text-[#78685B]">
                  <tr>
                    <th className="px-5 py-4">Coupon</th>
                    <th className="px-5 py-4">Discount</th>
                    <th className="px-5 py-4">Validity</th>
                    <th className="px-5 py-4">Usage</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFE6DA]">
                  {coupons.map((coupon) => {
                    const status = getStatus(coupon);

                    return (
                      <tr
                        key={coupon._id}
                        className="hover:bg-[#FCF8F1]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold tracking-wide text-[#351411]">
                            {coupon.code}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-[#817265]">
                            {coupon.description || "No description"}
                          </p>

                          {coupon.firstOrderOnly && (
                            <span className="mt-2 inline-block rounded-md bg-[#F0E8DE] px-2 py-1 text-[10px] text-[#765C4A]">
                              First order
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 font-medium">
                          {coupon.discountType === "PERCENT"
                            ? `${coupon.discountValue}% off`
                            : `${money(coupon.discountValue)} off`}

                          <p className="mt-1 text-xs text-[#817265]">
                            Min. {money(coupon.minOrderAmount)}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-xs leading-5 text-[#78685B]">
                          <p>
                            From{" "}
                            {new Date(
                              coupon.startDate
                            ).toLocaleDateString("en-IN")}
                          </p>

                          <p>
                            Until{" "}
                            {new Date(
                              coupon.expiryDate
                            ).toLocaleDateString("en-IN")}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p>
                            {coupon.usedCount || 0} /{" "}
                            {coupon.usageLimit ?? "∞"}
                          </p>

                          <p className="mt-1 text-xs text-[#817265]">
                            Uses recorded
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${statusClass(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="Edit coupon"
                              aria-label={`Edit ${coupon.code}`}
                              onClick={() => openEdit(coupon)}
                              className="rounded-lg border border-[#E4D9C9] p-2.5 text-[#4B1F1B] hover:bg-[#F4EDE2]"
                            >
                              <FiEdit2 size={15} />
                            </button>

                            <button
                              type="button"
                              title={
                                coupon.isActive
                                  ? "Disable coupon"
                                  : "Enable coupon"
                              }
                              aria-label={
                                coupon.isActive
                                  ? `Disable ${coupon.code}`
                                  : `Enable ${coupon.code}`
                              }
                              onClick={() => handleToggle(coupon)}
                              className="rounded-lg border border-[#E4D9C9] p-2.5 text-[#4B1F1B] hover:bg-[#F4EDE2]"
                            >
                              <FiPower size={15} />
                            </button>

                            <button
                              type="button"
                              title="Delete coupon"
                              aria-label={`Delete ${coupon.code}`}
                              onClick={() => handleDelete(coupon)}
                              className="rounded-lg border border-red-100 p-2.5 text-red-700 hover:bg-red-50"
                            >
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-[#2A1813]/50 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="my-4 w-full max-w-3xl rounded-2xl border border-[#E9DFD1] bg-[#FFFFFF] shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E9DFD1] px-5 py-5 sm:px-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A98243]">
                  Sirraha promotions
                </p>

                <h3 className="mt-1 font-serif text-2xl text-[#351411]">
                  {editingId ? "Edit coupon" : "Create coupon"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close coupon form"
                className="rounded-lg border border-[#E4D9C9] p-2 text-[#4B1F1B] hover:bg-[#F4EDE2]"
              >
                <FiX size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="space-y-5 p-5 sm:p-7"
            >
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Coupon code *
                
<input
  className={inputClass}
  name="code"
  value={form.code}
  onChange={setField}
  placeholder="e.g. FESTIVE20"
  required
  maxLength={30}
  autoComplete="off"
/>

                </label>

                <label className={labelClass}>
                  Description
                  <input
                    className={inputClass}
                    name="description"
                    value={form.description}
                    onChange={setField}
                    placeholder="Festive collection offer"
                  />
                </label>

                <label className={labelClass}>
                  Discount type *
                  <select
                    className={inputClass}
                    name="discountType"
                    value={form.discountType}
                    onChange={setField}
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed amount (₹)</option>
                  </select>
                </label>

                <label className={labelClass}>
                  Discount value *
                  <input
                    className={inputClass}
                    type="number"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={setField}
                    min="0.01"
                    max={
                      form.discountType === "PERCENT"
                        ? 100
                        : undefined
                    }
                    step="0.01"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Minimum order amount (₹)
                  <input
                    className={inputClass}
                    type="number"
                    name="minOrderAmount"
                    value={form.minOrderAmount}
                    onChange={setField}
                    min="0"
                    step="0.01"
                  />
                </label>

                <label className={labelClass}>
                  Maximum discount (₹)
                  <input
                    className={inputClass}
                    type="number"
                    name="maxDiscountAmount"
                    value={form.maxDiscountAmount}
                    onChange={setField}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                    disabled={form.discountType === "FIXED"}
                  />
                </label>

                <label className={labelClass}>
                  Start date and time *
                  <input
                    className={inputClass}
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={setField}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Expiry date and time *
                  <input
                    className={inputClass}
                    type="datetime-local"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={setField}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Total usage limit
                  <input
                    className={inputClass}
                    type="number"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={setField}
                    min="1"
                    step="1"
                    placeholder="Unlimited if blank"
                  />
                </label>
              </div>

              <div className="grid gap-3 rounded-xl bg-[#F7F1E8] p-4 sm:grid-cols-2">
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="firstOrderOnly"
                    checked={form.firstOrderOnly}
                    onChange={setField}
                    className="mt-1 accent-[#4B1F1B]"
                  />

                  <span>
                    <span className="block font-medium text-[#351411]">
                      First order only
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#817265]">
                      Only customers with no previous order can use
                      this offer.
                    </span>
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={setField}
                    className="mt-1 accent-[#4B1F1B]"
                  />

                  <span>
                    <span className="block font-medium text-[#351411]">
                      Coupon enabled
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#817265]">
                      Disable it any time without deleting the coupon.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E9DFD1] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#E4D9C9] px-5 py-3 text-sm font-medium hover:bg-[#F4EDE2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#4B1F1B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#351411] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponManagement;
