
import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../constants/api";

const emptyForm = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  status: "active",
};

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories(true);
      setCategories(data);
    } catch (err) {
      setError(err.message || "Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  let cancelled = false;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories(true);

      if (!cancelled) {
        setCategories(data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load categories.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchCategories();

  return () => {
    cancelled = true;
  };
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        sortOrder: Number(form.sortOrder),
        status: form.status,
      };

      if (editingId) {
        await updateCategory(editingId, payload);
        setMessage("Category updated successfully.");
      } else {
        await createCategory(payload);
        setMessage("Category created successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
      sortOrder: category.sortOrder ?? 0,
      status: category.status || "active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleStatus = async (category) => {
    try {
      setError("");
      setMessage("");

      await updateCategory(category._id, {
        status: category.status === "active" ? "inactive" : "active",
      });

      setMessage("Category status updated.");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to update category status.");
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Categories assigned to products cannot be deleted.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteCategory(category._id);

      setMessage("Category deleted successfully.");
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to delete category.");
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-[#DED4C4] bg-[#FFFDF9] px-3 py-3 text-sm text-[#43231C] outline-none focus:border-[#C8A15A]";

  return (
    <div className="min-h-screen bg-[#FAF7F0] px-4 py-8 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A98243]">
              Store Management
            </p>
            <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl text-[#43231C] sm:text-5xl">
              Categories
            </h1>
            <p className="mt-2 text-sm text-[#71655B]">
              Organise the collections customers can browse.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DED4C4] bg-[#FFFDF9] px-4 py-3 text-xs text-[#5A3026] hover:bg-[#F2EBDD]"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>

        {message && (
          <p role="status" className="mb-4 rounded-lg border border-[#D8BD83] bg-[#F7F2E9] p-3 text-sm text-[#5A3026]">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-[#E6D1CC] bg-[#FFF8F6] p-3 text-sm text-[#8C4A3C]">
            {error}
          </p>
        )}

        <div className="grid items-start gap-6 xl:grid-cols-[0.85fr_1.4fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9] p-5 sm:p-7"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#A98243]">
              {editingId ? "Edit category" : "New category"}
            </p>

            <h2 className="mt-2 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              {editingId ? "Update details" : "Create a category"}
            </h2>

            <label className="mt-6 block text-xs font-medium text-[#71655B]">
              Category name *
              <input
                className={fieldClass}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Short Kurtis"
                required
              />
            </label>

            <label className="mt-4 block text-xs font-medium text-[#71655B]">
              Description
              <textarea
                className={fieldClass}
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="A short description for this collection"
              />
            </label>

            <label className="mt-4 block text-xs font-medium text-[#71655B]">
              Image URL
              <input
                className={fieldClass}
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-[#71655B]">
                Sort order
                <input
                  className={fieldClass}
                  name="sortOrder"
                  type="number"
                  value={form.sortOrder}
                  onChange={handleChange}
                />
              </label>

              <label className="block text-xs font-medium text-[#71655B]">
                Status
                <select
                  className={fieldClass}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5A3026] px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#FFFDF9] hover:bg-[#43231C] disabled:opacity-50"
              >
                <FiPlus size={15} />
                {saving ? "Saving..." : editingId ? "Save changes" : "Create category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-[#DED4C4] px-4 py-3 text-xs text-[#5A3026] hover:bg-[#F2EBDD]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="overflow-hidden rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]">
            <div className="flex items-center justify-between border-b border-[#EAE2D5] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#A98243]">
                  Catalogue
                </p>
                <h2 className="mt-1 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                  All categories
                </h2>
              </div>
              <span className="rounded-full bg-[#F2EBDD] px-3 py-1 text-xs text-[#5A3026]">
                {categories.length}
              </span>
            </div>

            {loading ? (
              <p className="p-8 text-sm text-[#71655B]">Loading categories...</p>
            ) : categories.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
                  No categories yet
                </p>
                <p className="mt-2 text-sm text-[#71655B]">
                  Create your first category using the form.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EAE2D5]">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F2EBDD]">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center font-['Cormorant_Garamond'] text-xl text-[#A98243]">
                            {category.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#43231C]">
                          {category.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-[#918477]">
                          {category.description || category.slug}
                        </p>
                        <span className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                          category.status === "active"
                            ? "bg-[#F2EBDD] text-[#5A3026]"
                            : "bg-[#F3E2DE] text-[#8C4A3C]"
                        }`}>
                          {category.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(category)}
                        className="rounded-lg border border-[#DED4C4] px-3 py-2 text-xs text-[#5A3026] hover:bg-[#F2EBDD]"
                      >
                        {category.status === "active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditing(category)}
                        aria-label={`Edit ${category.name}`}
                        className="rounded-lg border border-[#DED4C4] p-2.5 text-[#5A3026] hover:bg-[#F2EBDD]"
                      >
                        <FiEdit2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-lg border border-[#E6D1CC] p-2.5 text-[#8C4A3C] hover:bg-[#FFF8F6]"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;
