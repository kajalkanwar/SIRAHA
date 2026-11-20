
import { useCallback, useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../constants/api";

const EMPTY_FORM = {
  title: "",
  message: "",
  occasion: "General",
  isActive: false,
  priority: 0,
  startDate: "",
  endDate: "",
};

const OCCASIONS = [
  "General",
  "Festive Sale",
  "Diwali",
  "Holi",
  "Wedding Season",
  "New Collection",
  "Shipping Offer",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] px-3 py-2.5 text-sm text-[#351C19] outline-none focus:border-[#A98243]";

const labelClass =
  "mb-1.5 block text-[10px] font-semibold uppercase tracking-[1.3px] text-[#6B5651]";

const toDateInput = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const localDate = new Date(
    value.getTime() - value.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
};

const formatDate = (date) => {
  if (!date) return "No limit";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "—";

  return value.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  let cancelled = false;

  const fetchAnnouncements = async () => {
    try {
      const data = await getAnnouncements();

      if (!cancelled) {
        setAnnouncements(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load announcements:", error);

      if (!cancelled) {
        setAnnouncements([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchAnnouncements();

  return () => {
    cancelled = true;
  };
}, []);

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const startEdit = (item) => {
    setEditingId(item._id);

    setForm({
      title: item.title || "",
      message: item.message || "",
      occasion: item.occasion || "General",
      isActive: Boolean(item.isActive),
      priority: Number(item.priority || 0),
      startDate: toDateInput(item.startDate),
      endDate: toDateInput(item.endDate),
    });

    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      setError("Please enter both a title and a message.");
      return;
    }

    const startDate = form.startDate
      ? new Date(form.startDate)
      : null;

    const endDate = form.endDate
      ? new Date(form.endDate)
      : null;

    if (
      startDate &&
      endDate &&
      endDate.getTime() <= startDate.getTime()
    ) {
      setError("End date must be after the start date.");
      return;
    }

    const payload = {
      title,
      message,
      occasion: form.occasion,
      isActive: form.isActive,
      priority: Number(form.priority),
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateAnnouncement(editingId, payload);
        setSuccess("Announcement updated successfully.");
      } else {
        await createAnnouncement(payload);
        setSuccess("Announcement created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...EMPTY_FORM });

      await loadAnnouncements();
    } catch (err) {
      setError(err.message || "Unable to save announcement.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      setError("");
      setSuccess("");

      await updateAnnouncement(item._id, {
        title: item.title,
        message: item.message,
        occasion: item.occasion || "General",
        isActive: !item.isActive,
        priority: Number(item.priority || 0),
        startDate: item.startDate || null,
        endDate: item.endDate || null,
      });

      setSuccess(
        `Announcement ${item.isActive ? "deactivated" : "activated"}.`
      );

      await loadAnnouncements();
    } catch (err) {
      setError(err.message || "Unable to update announcement status.");
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteAnnouncement(item._id);

      setSuccess("Announcement deleted successfully.");

      if (editingId === item._id) {
        setEditingId(null);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
      }

      await loadAnnouncements();
    } catch (err) {
      setError(err.message || "Unable to delete announcement.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FFFFFF] p-4 text-[#351C19] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#A98243]">
              Store Management
            </p>

            <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl text-[#351411] sm:text-5xl">
              Announcement Bar
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B5651]">
              Manage the messages displayed at the top of your Sirraha
              storefront. Announcements are informational only.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadAnnouncements}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3 text-xs font-medium text-[#4B1F1B] hover:bg-[#FFFFFF]"
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4B1F1B] px-4 py-3 text-xs font-medium text-[#FFFFFF] hover:bg-[#351411]"
            >
              <FiPlus size={15} />
              Create Announcement
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            {success}
          </div>
        )}

        {showForm && (
          <section className="mb-8 rounded-xl border border-[#E5DDD8] bg-[#FFFFFF] p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[2px] text-[#A98243]">
                  {editingId ? "Edit announcement" : "New announcement"}
                </p>

                <h2 className="mt-1 font-['Cormorant_Garamond'] text-3xl text-[#351411]">
                  {editingId ? "Update Message" : "Create Message"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close announcement form"
                className="rounded-full p-2 text-[#6B5651] hover:bg-[#FFFFFF]"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="announcement-title">
                    Internal title
                  </label>

                  <input
                    id="announcement-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    placeholder="Example: Diwali Special 2026"
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-[#918477]">
                    Used to identify the announcement in your admin panel.
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="announcement-occasion">
                    Occasion
                  </label>

                  <select
                    id="announcement-occasion"
                    name="occasion"
                    value={form.occasion}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {OCCASIONS.map((occasion) => (
                      <option key={occasion} value={occasion}>
                        {occasion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="announcement-message">
                  Customer-facing message
                </label>

                <textarea
                  id="announcement-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={250}
                  rows={3}
                  required
                  placeholder="Example: Diwali Special — Enjoy 20% OFF on selected styles."
                  className={inputClass}
                />

                <div className="mt-1 text-right text-[10px] text-[#918477]">
                  {form.message.length}/250 characters
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="announcement-start">
                    Start date and time (optional)
                  </label>

                  <input
                    id="announcement-start"
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-[#918477]">
                    Leave blank to allow immediate display when active.
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="announcement-end">
                    End date and time (optional)
                  </label>

                  <input
                    id="announcement-end"
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    min={form.startDate || undefined}
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-[#918477]">
                    Leave blank if the message has no scheduled end.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="announcement-priority">
                    Priority (0–100)
                  </label>

                  <input
                    id="announcement-priority"
                    type="number"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    min={0}
                    max={100}
                    step={1}
                    className={inputClass}
                  />

                  <p className="mt-1 text-[10px] text-[#918477]">
                    Higher priority wins when announcements overlap.
                  </p>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#E5DDD8] bg-[#FFFFFF] p-4">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#4B1F1B]"
                  />

                  <span>
                    <span className="block text-sm font-medium text-[#351411]">
                      Active announcement
                    </span>
                    <span className="mt-1 block text-xs text-[#6B5651]">
                      Only active, currently scheduled messages can appear.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-[#E5DDD8] pt-5">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#4B1F1B] px-5 py-3 text-xs font-medium text-[#FFFFFF] hover:bg-[#351411] disabled:opacity-60"
                >
                  <FiCheck size={15} />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Announcement"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ ...EMPTY_FORM });
                  }}
                  className="rounded-lg border border-[#E5DDD8] px-5 py-3 text-xs text-[#4B1F1B] hover:bg-[#FFFFFF]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-hidden rounded-xl border border-[#E5DDD8] bg-[#FFFFFF] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5DDD8] px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#351411]">
                All Announcements
              </h2>

              <p className="mt-1 text-xs text-[#6B5651]">
                {announcements.length} saved announcement
                {announcements.length === 1 ? "" : "s"}
              </p>
            </div>

            <FiBell className="text-[#A98243]" size={21} />
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-[#6B5651]">
              Loading announcements...
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <FiBell className="mx-auto mb-3 text-[#A98243]" size={28} />

              <p className="font-['Cormorant_Garamond'] text-2xl text-[#351411]">
                No announcements yet
              </p>

              <p className="mt-2 text-sm text-[#6B5651]">
                Create your first message for the Sirraha storefront.
              </p>

              <button
                type="button"
                onClick={startCreate}
                className="mt-5 rounded-lg bg-[#4B1F1B] px-5 py-3 text-xs text-[#FFFFFF]"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E9E0D3]">
              {announcements.map((item) => (
                <article key={item._id} className="p-5 sm:px-6">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-[#351411]">
                          {item.title}
                        </h3>

                        <span className="rounded-full bg-[#FFFFFF] px-2.5 py-1 text-[10px] text-[#4B1F1B]">
                          {item.occasion || "General"}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] ${
                            item.isActive
                              ? "bg-green-50 text-green-800"
                              : "bg-[#FFFFFF] text-[#6B5651]"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-3 break-words text-sm leading-6 text-[#5C5047]">
                        {item.message}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#918477]">
                        <span>Priority: {item.priority ?? 0}</span>
                        <span>Starts: {formatDate(item.startDate)}</span>
                        <span>Ends: {formatDate(item.endDate)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(item)}
                        className="rounded-lg border border-[#E5DDD8] px-3 py-2 text-xs text-[#4B1F1B] hover:bg-[#FFFFFF]"
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5DDD8] px-3 py-2 text-xs text-[#4B1F1B] hover:bg-[#FFFFFF]"
                      >
                        <FiEdit2 size={12} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700 hover:bg-red-50"
                      >
                        <FiTrash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Announcements;
