
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiPackage,
  FiRefreshCw,
  FiSave,
  FiSearch,
} from "react-icons/fi";

import {
  getInventory,
  updateProductInventory,
} from "../../constants/api";

const getSizes = (product) => {
  const sizes = [
    ...(Array.isArray(product.sizes) ? product.sizes : []),
    ...(Array.isArray(product.sizeInventory)
      ? product.sizeInventory.map((item) => item.size)
      : []),
  ];

  return [...new Set(sizes.map((size) => String(size).trim()).filter(Boolean))];
};

const getInventoryMap = (product) => {
  const map = {};

  (product.sizeInventory || []).forEach((item) => {
    map[item.size] = Number(item.stock || 0);
  });

  // Existing products may not have per-size inventory yet.
  // Keep their existing sizes visible, but require the admin to
  // allocate the legacy aggregate stock between sizes manually.
  getSizes(product).forEach((size) => {
    if (map[size] === undefined) map[size] = 0;
  });

  return map;
};

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [newSizes, setNewSizes] = useState({});
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();
      const list = Array.isArray(data) ? data : [];

      setProducts(list);

      const nextDrafts = {};
      list.forEach((product) => {
        nextDrafts[product._id] = getInventoryMap(product);
      });

      setDrafts(nextDrafts);
    } catch (err) {
      setError(err.message || "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  let cancelled = false;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();
      const list = Array.isArray(data) ? data : [];

      if (cancelled) return;

      setProducts(list);

      const nextDrafts = {};
      list.forEach((product) => {
        nextDrafts[product._id] = getInventoryMap(product);
      });

      setDrafts(nextDrafts);
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load inventory.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchInventory();

  return () => {
    cancelled = true;
  };
}, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category]
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [products, search]);

  const updateStock = (productId, size, value) => {
    const stock = value === "" ? "" : Math.max(0, Number(value));

    setDrafts((previous) => ({
      ...previous,
      [productId]: {
        ...previous[productId],
        [size]: stock,
      },
    }));
  };

  const addSize = (product) => {
    const size = (newSizes[product._id] || "").trim();

    if (!size) return;

    const existing = getSizes(product).map((item) => item.toLowerCase());

    if (existing.includes(size.toLowerCase())) {
      setError(`Size "${size}" already exists for ${product.name}.`);
      return;
    }

    setError("");
    setDrafts((previous) => ({
      ...previous,
      [product._id]: {
        ...previous[product._id],
        [size]: 0,
      },
    }));

    setProducts((previous) =>
      previous.map((item) =>
        item._id === product._id
          ? { ...item, sizes: [...getSizes(item), size] }
          : item
      )
    );

    setNewSizes((previous) => ({ ...previous, [product._id]: "" }));
  };

  const saveInventory = async (product) => {
    try {
      setSavingId(product._id);
      setError("");
      setMessage("");

      const inventory = Object.entries(drafts[product._id] || {}).map(
        ([size, stock]) => ({
          size,
          stock: stock === "" ? 0 : Number(stock),
        })
      );

      if (
        inventory.some(
          (item) => !Number.isInteger(item.stock) || item.stock < 0
        )
      ) {
        throw new Error("Stock must be a non-negative whole number.");
      }

      await updateProductInventory(product._id, inventory);

      setMessage(`${product.name} inventory updated successfully.`);
      await loadInventory();
    } catch (err) {
      setError(err.message || "Unable to update inventory.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] px-4 py-8 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#A98243]">
              Store Management
            </p>
            <h1 className="mt-2 font-['Cormorant_Garamond'] text-4xl text-[#43231C] sm:text-5xl">
              Inventory
            </h1>
            <p className="mt-2 text-sm text-[#71655B]">
              Update quantities for each size. Zero means unavailable.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInventory}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DED4C4] bg-[#FFFDF9] px-4 py-3 text-xs text-[#5A3026] hover:bg-[#F2EBDD]"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>

        <div className="mb-5 rounded-xl border border-[#D8BD83] bg-[#F7F2E9] p-4 text-sm leading-6 text-[#5A3026]">
          <div className="flex gap-3">
            <FiAlertCircle className="mt-1 shrink-0" />
            <p>
              Existing products with only a total stock value need their
              quantities allocated by size. Check the actual physical stock
              before saving. Saving replaces the per-size quantities and
              recalculates the total stock.
            </p>
          </div>
        </div>

        {message && (
          <p role="status" className="mb-4 rounded-lg border border-[#D8BD83] bg-[#FFFDF9] p-3 text-sm text-[#5A3026]">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mb-4 rounded-lg border border-[#E6D1CC] bg-[#FFF8F6] p-3 text-sm text-[#8C4A3C]">
            {error}
          </p>
        )}

        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#DED4C4] bg-[#FFFDF9] px-4 py-3">
          <FiSearch size={17} className="text-[#A98243]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products or categories..."
            className="w-full bg-transparent text-sm text-[#43231C] outline-none"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#EAE2D5] bg-[#FFFDF9] p-10 text-sm text-[#71655B]">
            Loading inventory...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-[#EAE2D5] bg-[#FFFDF9] p-10 text-center">
            <FiPackage className="mx-auto text-[#A98243]" size={25} />
            <p className="mt-3 font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              No products found
            </p>
            <p className="mt-1 text-sm text-[#71655B]">
              Try another search or add products first.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredProducts.map((product) => {
              const sizes = [
                ...new Set([
                  ...getSizes(product),
                  ...Object.keys(drafts[product._id] || {}),
                ]),
              ];

              const inventory = drafts[product._id] || {};
              const total = sizes.reduce(
                (sum, size) => sum + Number(inventory[size] || 0),
                0
              );

              return (
                <section
                  key={product._id}
                  className="overflow-hidden rounded-2xl border border-[#EAE2D5] bg-[#FFFDF9]"
                >
                  <div className="flex flex-col gap-4 border-b border-[#EAE2D5] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F2EBDD]">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#A98243]">
                            <FiPackage size={19} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-sm font-medium text-[#43231C]">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-xs text-[#918477]">
                          {product.category}
                        </p>
                        <p className="mt-1 text-xs text-[#71655B]">
                          Saved total stock: {product.stock ?? 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#918477]">
                          Draft total
                        </p>
                        <p className="font-['Cormorant_Garamond'] text-3xl text-[#43231C]">
                          {total}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => saveInventory(product)}
                        disabled={savingId === product._id}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#5A3026] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#FFFDF9] hover:bg-[#43231C] disabled:opacity-50"
                      >
                        <FiSave size={14} />
                        {savingId === product._id ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    {sizes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                        {sizes.map((size) => {
                          const stock = Number(inventory[size] || 0);

                          return (
                            <label
                              key={size}
                              className="rounded-xl border border-[#EAE2D5] bg-[#FCF9F3] p-3"
                            >
                              <span className="flex items-center justify-between gap-2 text-xs font-medium text-[#43231C]">
                                Size {size}
                                <span className={`text-[10px] ${stock > 0 ? "text-[#6F806F]" : "text-[#8C4A3C]"}`}>
                                  {stock > 0 ? "Available" : "Unavailable"}
                                </span>
                              </span>

                              <input
                                type="number"
                                min="0"
                                step="1"
                                value={inventory[size] ?? 0}
                                onChange={(event) =>
                                  updateStock(
                                    product._id,
                                    size,
                                    event.target.value
                                  )
                                }
                                className="mt-3 w-full rounded-lg border border-[#DED4C4] bg-[#FFFDF9] px-3 py-2 text-center text-sm text-[#43231C] outline-none focus:border-[#C8A15A]"
                              />

                              <span className="mt-2 block text-[10px] text-[#918477]">
                                {stock} {stock === 1 ? "piece" : "pieces"} left
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-[#71655B]">
                        This product has no sizes yet. Add sizes in Product
                        Management before setting per-size stock.
                      </p>
                    )}

                    <div className="mt-5 flex flex-col gap-3 border-t border-[#EAE2D5] pt-5 sm:flex-row">
                      <input
                        value={newSizes[product._id] || ""}
                        onChange={(event) =>
                          setNewSizes((previous) => ({
                            ...previous,
                            [product._id]: event.target.value,
                          }))
                        }
                        placeholder="Add a size (e.g. XXL or Free Size)"
                        className="min-w-0 flex-1 rounded-lg border border-[#DED4C4] bg-[#FFFDF9] px-3 py-3 text-sm outline-none focus:border-[#C8A15A]"
                      />

                      <button
                        type="button"
                        onClick={() => addSize(product)}
                        className="rounded-lg border border-[#D8BD83] px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#5A3026] hover:bg-[#F2EBDD]"
                      >
                        Add size
                      </button>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryManagement;
