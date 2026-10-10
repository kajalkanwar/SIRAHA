import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

function SavedAddresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // ==========================================
  // FETCH SAVED ADDRESSES
  // ==========================================

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/addresses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch addresses."
          );
        }

        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Fetch addresses error:", err);

        setError(
          err.message || "Unable to load saved addresses."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [navigate]);

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (savedAddress) => {
    setEditingId(savedAddress._id);

    setForm({
      fullName: savedAddress.fullName || "",
      phone: savedAddress.phone || "",
      address: savedAddress.address || "",
      city: savedAddress.city || "",
      state: savedAddress.state || "",
      pincode: savedAddress.pincode || "",
      isDefault: Boolean(savedAddress.isDefault),
    });

    setFormError("");
    setShowForm(true);
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  // ==========================================
  // ADD / UPDATE ADDRESS
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setFormError("Please fill in all address details.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const url = editingId
        ? `${API_URL}/addresses/${editingId}`
        : `${API_URL}/addresses`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save address."
        );
      }

      // Update addresses immediately with API response
      setAddresses(data.addresses || []);

      // Close modal after successful save
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setFormError("");
    } catch (err) {
      console.error("Save address error:", err);

      setFormError(
        err.message || "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE ADDRESS
  // ==========================================

  const handleDelete = async (addressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete address."
        );
      }

      setAddresses(data.addresses || []);
    } catch (err) {
      console.error("Delete address error:", err);

      setError(
        err.message || "Unable to delete address."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4EC]">
        <p className="text-sm uppercase tracking-[0.2em] text-[#0E5B3B]">
          Loading addresses...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EC] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* ==========================================
            BACK TO ACCOUNT
        ========================================== */}

        <button
          type="button"
          onClick={() => navigate("/account")}
          className="mb-10 flex items-center gap-2 text-sm text-[#1F2937] transition hover:text-[#0E5B3B]"
        >
          <FiArrowLeft size={16} />
          Back to My Account
        </button>

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-10 flex flex-col gap-5 border-b border-[#E5E0D6] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#0E5B3B]">
              Your Details
            </p>

            <h1 className="font-serif text-4xl text-[#111827] sm:text-5xl">
              Saved Addresses
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Save your delivery details for a faster checkout
              experience.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-[#0E5B3B] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#09482F]"
          >
            <FiPlus size={16} />
            Add Address
          </button>
        </div>

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ==========================================
            NO ADDRESSES
        ========================================== */}

        {addresses.length === 0 ? (
          <div className="border border-[#E5E0D6] bg-white px-6 py-16 text-center sm:px-10">
            <FiMapPin
              size={34}
              className="mx-auto mb-5 text-[#0E5B3B]"
            />

            <h2 className="font-serif text-2xl text-[#111827]">
              No saved addresses
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Add your delivery address here and it will be
              available for future orders.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-7 border border-[#0E5B3B] px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-[#0E5B3B] transition hover:bg-[#0E5B3B] hover:text-white"
            >
              Add Your First Address
            </button>
          </div>
        ) : (

          /* ==========================================
             ADDRESS CARDS
          ========================================== */

          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((savedAddress) => (
              <div
                key={savedAddress._id}
                className="relative border border-[#E5E0D6] bg-white p-6 sm:p-7"
              >
                {/* Default Badge */}

                {savedAddress.isDefault && (
                  <span className="absolute right-5 top-5 bg-[#F8F4EC] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#0E5B3B]">
                    Default
                  </span>
                )}

                {/* Address Details */}

                <div className="pr-20">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F4EC] text-[#0E5B3B]">
                      <FiMapPin size={18} />
                    </div>

                    <div>
                      <h2 className="font-serif text-xl text-[#111827]">
                        {savedAddress.fullName}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        {savedAddress.phone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm leading-6 text-gray-600">
                    <p>{savedAddress.address}</p>

                    <p>
                      {savedAddress.city},{" "}
                      {savedAddress.state}
                    </p>

                    <p>{savedAddress.pincode}</p>
                  </div>
                </div>

                {/* Actions */}

                <div className="mt-7 flex items-center gap-5 border-t border-[#E5E0D6] pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(savedAddress)
                    }
                    className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#0E5B3B] transition hover:opacity-70"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(savedAddress._id)
                    }
                    className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500 transition hover:text-red-600"
                  >
                    <FiTrash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==========================================
          ADD / EDIT ADDRESS MODAL
      ========================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-6 sm:p-8">

            {/* Close Button */}

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="absolute right-5 top-5 text-gray-500 transition hover:text-[#0E5B3B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiX size={22} />
            </button>

            {/* Modal Header */}

            <div className="mb-8 pr-8">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#0E5B3B]">
                {editingId
                  ? "Update Details"
                  : "New Address"}
              </p>

              <h2 className="font-serif text-3xl text-[#111827]">
                {editingId
                  ? "Edit Address"
                  : "Add Address"}
              </h2>
            </div>

            {/* Form Error */}

            {formError && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Full Name */}

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                />
              </div>

              {/* Address */}

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Street / Area"
                  rows={3}
                  className="w-full resize-none border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                />
              </div>

              {/* City + State */}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                  />
                </div>
              </div>

              {/* Pincode */}

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-gray-600">
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="w-full border border-[#E5E0D6] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0E5B3B]"
                />
              </div>

              {/* Default Address */}

              <label className="flex cursor-pointer items-center gap-3 pt-1 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#0E5B3B]"
                />

                <span>
                  Set as default address
                </span>
              </label>

              {/* Buttons */}

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#0E5B3B] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#09482F] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="border border-[#E5E0D6] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-gray-600 transition hover:border-[#0E5B3B] hover:text-[#0E5B3B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedAddresses;