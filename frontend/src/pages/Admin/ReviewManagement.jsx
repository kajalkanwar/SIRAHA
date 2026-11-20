
import { useCallback, useEffect, useState } from "react";
import {
  FiMessageSquare,
  FiStar,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiX,
  FiEye,
  FiCalendar,
  FiPackage,
  FiUser,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { getAdminReviews, deleteReview } from "../../constants/api";

const ITEMS_PER_PAGE = 8;

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getReviewId = (review) => review?._id || review?.id;

const StarRating = ({ rating = 0, size = 15 }) => {
  const value = Math.min(5, Math.max(0, Number(rating) || 0));

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          className={
            star <= value
              ? "fill-[#C9A24A] text-[#C9A24A]"
              : "text-[#D8D0C6]"
          }
        />
      ))}
    </div>
  );
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "C";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");

  const loadReviews = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getAdminReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Unable to load customer reviews.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    loadReviews();
  }, 0);

  return () => clearTimeout(timer);
}, [loadReviews]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredReviews = reviews.filter((review) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [
        review.customerName,
        review.productName,
        review.title,
        review.message,
      ].some((value) => String(value || "").toLowerCase().includes(query));

    const matchesRating =
      ratingFilter === "all" ||
      Number(review.rating) === Number(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedReviews = filteredReviews.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (total, review) => total + (Number(review.rating) || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => Number(review.rating) === 5
  ).length;

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRatingFilter = (value) => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    const id = getReviewId(reviewToDelete);

    if (!id) {
      setNotice("This review does not have a valid ID.");
      setReviewToDelete(null);
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await deleteReview(id);

      setReviews((previous) =>
        previous.filter((review) => getReviewId(review) !== id)
      );

      if (getReviewId(selectedReview) === id) {
        setSelectedReview(null);
      }

      setNotice("Review deleted successfully.");
      setReviewToDelete(null);
    } catch (err) {
      setError(err?.message || "Unable to delete this review.");
    } finally {
      setDeleting(false);
    }
  };

  const closeDetails = () => setSelectedReview(null);

  useEffect(() => {
    if (!selectedReview && !reviewToDelete) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !deleting) {
        setSelectedReview(null);
        setReviewToDelete(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedReview, reviewToDelete, deleting]);

  return (
    <div className="min-h-screen bg-[#F8F5F0] px-4 py-6 text-[#35251F] sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#99774A]">
              <span className="h-px w-7 bg-[#C9A24A]" />
              Customer experience
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#492C28] sm:text-4xl">
              Review Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#887A70]">
              Read customer feedback and keep Sirraha&apos;s review section
              thoughtful, relevant, and welcoming.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadReviews(true)}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#E6DCD0] bg-white px-4 py-3 text-sm font-medium text-[#593C34] shadow-sm transition hover:border-[#C9A24A] hover:bg-[#FFFCF7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh reviews
          </button>
        </div>

        {/* Notifications */}
        {notice && (
          <div
            role="status"
            className="mb-5 flex items-center gap-3 rounded-xl border border-[#D8E7D8] bg-[#F0F7EF] px-4 py-3 text-sm text-[#35633D]"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="ml-auto rounded-lg p-1 hover:bg-[#E2EFE0]"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-[#E9C8C0] bg-[#FFF5F2] px-4 py-3 text-sm text-[#963F32]"
          >
            <FiAlertCircle className="mt-0.5 shrink-0" size={17} />
            <div className="min-w-0 flex-1">{error}</div>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="rounded-lg p-1 hover:bg-[#FBE7E1]"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard
            icon={<FiMessageSquare size={20} />}
            label="Total reviews"
            value={reviews.length}
            description="Customer feedback received"
          />

          <SummaryCard
            icon={<FiStar size={20} />}
            label="Average rating"
            value={averageRating}
            description="Out of 5 stars"
            rating
          />

          <SummaryCard
            icon={<FiStar size={20} />}
            label="5-star reviews"
            value={fiveStarReviews}
            description={
              reviews.length
                ? `${Math.round((fiveStarReviews / reviews.length) * 100)}% of all reviews`
                : "No reviews received yet"
            }
          />
        </div>

        {/* Main panel */}
        <section className="overflow-hidden rounded-2xl border border-[#E9E0D6] bg-white shadow-[0_4px_24px_rgba(68,42,31,0.035)]">
          <div className="border-b border-[#EEE7DF] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#492C28]">
                  Customer feedback
                </h2>
                <p className="mt-1 text-sm text-[#95877D]">
                  {filteredReviews.length}{" "}
                  {filteredReviews.length === 1 ? "review" : "reviews"} found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 sm:w-72">
                  <FiSearch
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8998D]"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => handleSearch(event.target.value)}
                    placeholder="Search customer or product..."
                    aria-label="Search reviews"
                    className="w-full rounded-xl border border-[#E9E0D6] bg-[#FFFEFC] py-3 pl-10 pr-4 text-sm text-[#492C28] outline-none transition placeholder:text-[#B0A49A] focus:border-[#B79A68] focus:ring-2 focus:ring-[#C9A24A]/15"
                  />
                </div>

                <select
                  value={ratingFilter}
                  onChange={(event) => handleRatingFilter(event.target.value)}
                  aria-label="Filter reviews by rating"
                  className="rounded-xl border border-[#E9E0D6] bg-[#FFFEFC] px-3.5 py-3 text-sm text-[#593C34] outline-none transition focus:border-[#B79A68] focus:ring-2 focus:ring-[#C9A24A]/15"
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredReviews.length === 0 ? (
            <EmptyState
              hasFilters={Boolean(search.trim()) || ratingFilter !== "all"}
              onReset={() => {
                setSearch("");
                setRatingFilter("all");
                setCurrentPage(1);
              }}
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#EEE7DF] bg-[#FCFAF7]">
                      <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A09286]">
                        Customer
                      </th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A09286]">
                        Review
                      </th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A09286]">
                        Product
                      </th>
                      <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A09286]">
                        Submitted
                      </th>
                      <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.13em] text-[#A09286]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#F0EAE3]">
                    {paginatedReviews.map((review) => {
                      const id = getReviewId(review);

                      return (
                        <tr
                          key={id}
                          className="transition-colors hover:bg-[#FFFCF8]"
                        >
                          <td className="px-6 py-5 align-top">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9DCCB] bg-[#F6EDE1] text-xs font-semibold text-[#71483D]">
                                {getInitials(review.customerName)}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[150px] truncate text-sm font-semibold text-[#4C332D]">
                                  {review.customerName || "Customer"}
                                </p>
                                <p className="mt-1 text-xs text-[#A09286]">
                                  Customer review
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[310px] px-5 py-5 align-top">
                            <StarRating rating={review.rating} />

                            <p className="mt-2 truncate text-sm font-semibold text-[#52382F]">
                              {review.title || "Untitled review"}
                            </p>

                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#8D8076]">
                              {review.message || "No review message."}
                            </p>

                            {Array.isArray(review.photos) &&
                              review.photos.length > 0 && (
                                <span className="mt-2 inline-flex items-center rounded-full bg-[#F7F0E6] px-2.5 py-1 text-[11px] font-medium text-[#88673B]">
                                  {review.photos.length}{" "}
                                  {review.photos.length === 1
                                    ? "photo"
                                    : "photos"}
                                </span>
                              )}
                          </td>

                          <td className="max-w-[180px] px-5 py-5 align-top">
                            <p className="line-clamp-2 text-sm text-[#654B40]">
                              {review.productName || "Product unavailable"}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-[#8D8076]">
                            {formatDate(review.createdAt)}
                          </td>

                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center justify-end gap-2">
                              <IconButton
                                label="View review"
                                onClick={() => setSelectedReview(review)}
                              >
                                <FiEye size={16} />
                              </IconButton>

                              <IconButton
                                label="Delete review"
                                danger
                                onClick={() => setReviewToDelete(review)}
                              >
                                <FiTrash2 size={16} />
                              </IconButton>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                {paginatedReviews.map((review) => (
                  <article
                    key={getReviewId(review)}
                    className="rounded-xl border border-[#EEE5DA] bg-[#FFFEFC] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6EDE1] text-xs font-semibold text-[#71483D]">
                        {getInitials(review.customerName)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#4C332D]">
                            {review.customerName || "Customer"}
                          </p>
                          <span className="text-xs text-[#A09286]">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        <div className="mt-2">
                          <StarRating rating={review.rating} size={14} />
                        </div>

                        <h3 className="mt-2 text-sm font-semibold text-[#52382F]">
                          {review.title || "Untitled review"}
                        </h3>

                        <p className="mt-1 break-words text-sm leading-6 text-[#8D8076]">
                          {review.message || "No review message."}
                        </p>

                        <p className="mt-3 flex items-start gap-2 text-xs text-[#9A887A]">
                          <FiPackage size={14} className="mt-0.5 shrink-0" />
                          <span>
                            {review.productName || "Product unavailable"}
                          </span>
                        </p>

                        <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#F0EAE3] pt-3">
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#E8DED2] px-3 py-2 text-xs font-medium text-[#694B40] transition hover:bg-[#F8F2EA]"
                          >
                            <FiEye size={14} />
                            View details
                          </button>

                          <button
                            type="button"
                            onClick={() => setReviewToDelete(review)}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#EACDC7] px-3 py-2 text-xs font-medium text-[#A3483A] transition hover:bg-[#FFF2EF]"
                          >
                            <FiTrash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-[#EEE7DF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[#998A7E]">
                  Showing{" "}
                  <span className="font-semibold text-[#654B40]">
                    {(safePage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(
                      safePage * ITEMS_PER_PAGE,
                      filteredReviews.length
                    )}
                  </span>{" "}
                  of {filteredReviews.length} reviews
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9E0D6] px-3 py-2 text-xs font-medium text-[#654B40] transition hover:bg-[#F8F2EA] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft size={15} />
                    Previous
                  </button>

                  <span className="px-2 text-xs font-medium text-[#8D8076]">
                    {safePage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E9E0D6] px-3 py-2 text-xs font-medium text-[#654B40] transition hover:bg-[#F8F2EA] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <FiChevronRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        <p className="mt-5 text-center text-xs tracking-wide text-[#B0A196]">
          SIRRAHA · Thoughtful details, meaningful feedback.
        </p>
      </div>

      {/* Review details modal */}
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={closeDetails}
          onDelete={() => {
            setReviewToDelete(selectedReview);
            setSelectedReview(null);
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {reviewToDelete && (
        <DeleteConfirmationModal
          review={reviewToDelete}
          deleting={deleting}
          onCancel={() => {
            if (!deleting) setReviewToDelete(null);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

const SummaryCard = ({ icon, label, value, description, rating = false }) => (
  <div className="rounded-2xl border border-[#E9E0D6] bg-white p-5 shadow-[0_4px_24px_rgba(68,42,31,0.025)] sm:p-6">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-[#948479]">{label}</p>

        <div className="mt-3 flex items-center gap-2">
          <span className="text-3xl font-semibold tracking-tight text-[#492C28]">
            {value}
          </span>

          {rating && <StarRating rating={Number(value)} size={15} />}
        </div>

        <p className="mt-2 text-xs text-[#A99A8F]">{description}</p>
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EDE1D0] bg-[#FBF5EB] text-[#A17D42]">
        {icon}
      </div>
    </div>
  </div>
);

const IconButton = ({ children, label, onClick, danger = false }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition ${
      danger
        ? "border-[#EED7D1] bg-white text-[#A94D3E] hover:border-[#DCA99E] hover:bg-[#FFF2EF]"
        : "border-[#E8DED2] bg-white text-[#77594C] hover:border-[#C9A24A] hover:bg-[#FBF5EB]"
    }`}
  >
    {children}
  </button>
);

const LoadingState = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center">
    <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#E8DCCB] border-t-[#99774A]" />
    <p className="mt-4 text-sm font-medium text-[#654B40]">
      Loading customer reviews
    </p>
    <p className="mt-1 text-xs text-[#A09286]">
      Please wait while we fetch the latest feedback.
    </p>
  </div>
);

const EmptyState = ({ hasFilters, onReset }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-16 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E9DDCB] bg-[#FBF5EB] text-[#A17D42]">
      <FiMessageSquare size={26} />
    </div>

    <h3 className="mt-5 text-lg font-semibold text-[#492C28]">
      {hasFilters ? "No matching reviews" : "No reviews yet"}
    </h3>

    <p className="mt-2 max-w-sm text-sm leading-6 text-[#95877D]">
      {hasFilters
        ? "Try changing your search or rating filter to find the review you're looking for."
        : "Customer reviews will appear here when shoppers share their feedback."}
    </p>

    {hasFilters && (
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-xl border border-[#E4D6C3] px-4 py-2.5 text-sm font-medium text-[#77563F] transition hover:bg-[#FBF5EB]"
      >
        Clear filters
      </button>
    )}
  </div>
);

const ReviewDetailsModal = ({ review, onClose, onDelete }) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#241712]/55 p-4 backdrop-blur-[3px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-details-title"
      className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#E9E0D6] bg-white shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-[#EEE7DF] px-5 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A17D42]">
            Customer feedback
          </p>
          <h2
            id="review-details-title"
            className="mt-1 font-serif text-2xl font-semibold text-[#492C28]"
          >
            Review details
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close review details"
          className="rounded-lg p-2 text-[#8F7E72] transition hover:bg-[#F7F1E9] hover:text-[#492C28]"
        >
          <FiX size={19} />
        </button>
      </div>

      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E9DCCB] bg-[#F6EDE1] font-semibold text-[#71483D]">
            {getInitials(review.customerName)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[#4C332D]">
              {review.customerName || "Customer"}
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <StarRating rating={review.rating} />

              <span className="text-xs text-[#9D8C80]">
                {Number(review.rating) || 0}/5
              </span>
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#9D8C80]">
              <FiCalendar size={13} />
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#EEE5DA] bg-[#FFFCF8] p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-[#492C28]">
            {review.title || "Untitled review"}
          </h3>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#78685D]">
            {review.message || "No review message."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#EEE5DA] p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-[#9D8C80]">
              <FiPackage size={14} />
              Product
            </p>
            <p className="mt-2 break-words text-sm font-medium text-[#593C34]">
              {review.productName || "Product unavailable"}
            </p>
          </div>

          <div className="rounded-xl border border-[#EEE5DA] p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-[#9D8C80]">
              <FiUser size={14} />
              Reviewer
            </p>
            <p className="mt-2 break-words text-sm font-medium text-[#593C34]">
              {review.customerName || "Customer"}
            </p>
            {review.isVerifiedPurchase && (
              <span className="mt-2 inline-flex rounded-full bg-[#EEF5EC] px-2.5 py-1 text-[11px] font-medium text-[#4E774D]">
                Verified purchase
              </span>
            )}
          </div>
        </div>

        {Array.isArray(review.photos) && review.photos.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#593C34]">
              Customer photos ({review.photos.length})
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {review.photos.map((photo, index) => {
                const imageUrl =
                  typeof photo === "string" ? photo : photo?.url;

                if (!imageUrl) return null;

                return (
                  <a
                    key={photo?.publicId || imageUrl || index}
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-xl border border-[#E9E0D6] bg-[#FAF7F2]"
                    aria-label={`Open customer photo ${index + 1} in a new tab`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Customer review ${index + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#EEE7DF] bg-[#FFFEFC] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-[#E5D9CB] px-4 py-2.5 text-sm font-medium text-[#654B40] transition hover:bg-[#F8F2EA]"
        >
          Close
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8F3E32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#773126]"
        >
          <FiTrash2 size={15} />
          Delete review
        </button>
      </div>
    </section>
  </div>
);

const DeleteConfirmationModal = ({
  review,
  deleting,
  onCancel,
  onConfirm,
}) => (
  <div
    className="fixed inset-0 z-[110] flex items-center justify-center bg-[#241712]/60 p-4 backdrop-blur-[3px]"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget && !deleting) onCancel();
    }}
  >
    <section
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-review-title"
      aria-describedby="delete-review-description"
      className="w-full max-w-md rounded-2xl border border-[#E9E0D6] bg-white p-6 shadow-2xl sm:p-7"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#EACDC7] bg-[#FFF2EF] text-[#A3483A]">
        <FiTrash2 size={21} />
      </div>

      <h2
        id="delete-review-title"
        className="mt-5 text-xl font-semibold text-[#492C28]"
      >
        Delete this review?
      </h2>

      <p
        id="delete-review-description"
        className="mt-2 text-sm leading-6 text-[#8D8076]"
      >
        You&apos;re about to permanently delete the review by{" "}
        <span className="font-semibold text-[#654B40]">
          {review.customerName || "this customer"}
        </span>
        . This action cannot be undone.
      </p>

      {review.title && (
        <div className="mt-4 rounded-xl border border-[#EEE5DA] bg-[#FFFCF8] p-3">
          <p className="text-xs font-medium text-[#A09286]">Review title</p>
          <p className="mt-1 text-sm font-medium text-[#593C34]">
            {review.title}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={deleting}
          onClick={onCancel}
          className="rounded-xl border border-[#E5D9CB] px-4 py-2.5 text-sm font-medium text-[#654B40] transition hover:bg-[#F8F2EA] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8F3E32] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#773126] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {deleting ? "Deleting..." : "Yes, delete review"}
        </button>
      </div>
    </section>
  </div>
);

export default ReviewManagement;