
import { useEffect, useRef, useState } from "react";
import {
  getReviews,
  submitReview,
} from "../../constants/api.js";

const MAX_PHOTOS = 1;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const initialForm = {
  customerName: "",
  rating: 5,
  title: "",
  message: "",
  productName: "",
};

function StarRating({
  rating = 0,
  interactive = false,
  onChange,
  size = "text-xl",
}) {
  return (
    <div
      className="flex items-center gap-1"
      role={interactive ? "group" : "img"}
      aria-label={
        interactive
          ? `Selected rating: ${rating} out of 5`
          : `${rating} out of 5 stars`
      }
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} out of 5 stars`}
            aria-pressed={rating === star}
            className={`${size} leading-none transition-colors ${
              star <= rating
                ? "text-[#C8A15A]"
                : "text-[#E5DDD8] hover:text-[#C8A15A]"
            }`}
          >
            ★
          </button>
        ) : (
          <span
            key={star}
            aria-hidden="true"
            className={`${size} leading-none ${
              star <= rating
                ? "text-[#C8A15A]"
                : "text-[#E5DDD8]"
            }`}
          >
            ★
          </span>
        )
      )}
    </div>
  );
}

function ReviewCard({ review }) {
  const photos = Array.isArray(review.photos)
    ? review.photos.filter((photo) => photo?.url)
    : [];

  const date = review.createdAt
    ? new Date(review.createdAt)
    : null;

  const formattedDate =
    date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <article className="sirraha-review-card flex h-full flex-col overflow-hidden rounded-xl border border-[#F1ECE9] bg-white shadow-[0_5px_22px_rgba(67,35,28,0.10)]">
      {/* Customer-submitted photos */}
      {photos.length > 0 ? (
        <div className="grid aspect-[4/3] grid-cols-1 overflow-hidden bg-[#FFFFFF]">
          <img
            src={photos[0].url}
            alt={`Outfit photo shared by ${review.customerName}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-[#FFFFFF]">
          <span className="font-['Cormorant_Garamond'] text-3xl tracking-[0.2em] text-[#69352D]">
            SIRRAHA
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center px-5 py-6 text-center sm:px-6">
        <StarRating rating={Number(review.rating) || 0} size="text-2xl" />

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <p className="font-['Poppins'] text-sm font-medium text-[#D97575]">
            {review.customerName}
          </p>

          {review.isVerifiedPurchase === true && (
            <span className="rounded-sm bg-[#D97575] px-2 py-1 text-[10px] font-semibold text-white">
              Verified
            </span>
          )}
        </div>

        <h3 className="mt-4 font-['Poppins'] text-base font-semibold text-[#351411]">
          {review.title}
        </h3>

        <p className="mt-2 w-full flex-1 whitespace-pre-wrap break-words text-sm leading-7 text-[#625B57]">
          {review.message}
        </p>

        {review.productName && (
          <p className="mt-5 line-clamp-2 text-xs leading-5 text-[#6B5651]">
            {review.productName}
          </p>
        )}

        {photos.length > 1 && (
          <p className="mt-2 text-[11px] text-[#918477]">
            +{photos.length - 1} more{" "}
            {photos.length - 1 === 1 ? "photo" : "photos"}
          </p>
        )}

        {formattedDate && (
          <p className="mt-2 text-xs text-[#918477]">
            {formattedDate}
          </p>
        )}
      </div>
    </article>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submissionLock = useRef(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  // Fetch public reviews. New reviews are visible immediately.
  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      try {
        const data = await getReviews();

        if (mounted) {
          setReviews(Array.isArray(data) ? data : []);
          setLoadError("");
        }
      } catch (error) {
        console.error("Unable to load Sirraha reviews:", error);

        if (mounted) {
          setLoadError(
            "Customer reviews are temporarily unavailable."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      mounted = false;
    };
  }, []);

  // Clean up local photo preview URLs.
  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    setSubmitError("");
    setSuccess("");

    const files = Array.from(event.target.files || []);

    if (files.length > MAX_PHOTOS) {
      setSubmitError("Please select only one photo.");
      event.target.value = "";
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setSubmitError(
          "Please upload JPG, PNG, or WebP images only."
        );
        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setSubmitError(
          "Each photo must be 5 MB or smaller."
        );
        event.target.value = "";
        return;
      }
    }

    setPhotoPreviews((previous) => {
      previous.forEach((url) => URL.revokeObjectURL(url));
      return files.map((file) => URL.createObjectURL(file));
    });

    setSelectedPhotos(files);
  };

  const removePhoto = (index) => {
    setSelectedPhotos((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setPhotoPreviews((previous) => {
      const urlToRemove = previous[index];

      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove);
      }

      return previous.filter((_, i) => i !== index);
    });

    const input = document.getElementById("sirraha-review-photos");

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent a second request while the first submission is in progress.
    if (submissionLock.current) return;

    setSubmitError("");
    setSuccess("");

    if (!form.customerName.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }

    if (!form.title.trim()) {
      setSubmitError("Please enter a review title.");
      return;
    }

    if (form.message.trim().length < 10) {
      setSubmitError(
        "Please write at least 10 characters in your review."
      );
      return;
    }

    if (selectedPhotos.length > MAX_PHOTOS) {
      setSubmitError("You can upload only one photo.");
      return;
    }

    // Set synchronously before the first await so rapid clicks cannot
    // send duplicate POST requests before React re-renders.
    submissionLock.current = true;
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("customerName", form.customerName.trim());
      formData.append("rating", String(Number(form.rating)));
      formData.append("title", form.title.trim());
      formData.append("message", form.message.trim());
      formData.append("productName", form.productName.trim());

      selectedPhotos.forEach((photo) => {
        formData.append("photos", photo);
      });

      const result = await submitReview(formData);

      setSuccess(
        result?.message ||
          "Thank you! Your review has been published."
      );

      // Add the newly created review immediately when the API returns it.
      const createdReview = result?.review || result?.data?.review;
      if (createdReview) {
        setReviews((previous) => [createdReview, ...previous]);
      }

      setIsReviewFormOpen(false);

      setForm({ ...initialForm });

      setPhotoPreviews((previous) => {
        previous.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });

      setSelectedPhotos([]);

      const photoInput = document.getElementById(
        "sirraha-review-photos"
      );

      if (photoInput) {
        photoInput.value = "";
      }
    } catch (error) {
      console.error("Review submission failed:", error);

      setSubmitError(
        error?.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  };

  const canAnimate = reviews.length > 1;

  return (
    <section
      className="w-full overflow-hidden bg-[#FFFFFF] px-4 py-16 sm:px-7 sm:py-20 lg:px-10 lg:py-24"
      aria-labelledby="sirraha-reviews-heading"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section heading */}
        <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <p className="mb-3 font-['Poppins'] text-[10px] font-medium uppercase tracking-[3px] text-[#A98243]">
            The Sirraha Edit
          </p>

          <h3
            id="sirraha-reviews-heading"
            className="font-['Cormorant_Garamond'] text-xl font-medium text-[#4B1F1B] sm:text-5xl lg:text-5xl"
          >
            Customer Reviews
          </h3>

          {/* <div className="mx-auto mt-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#C8A15A]" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#C8A15A]" />
            <span className="h-px w-10 bg-[#C8A15A]" />
          </div> */}

          <p className="mt-5 text-sm leading-7 text-[#6B5651] sm:text-base">
            Our customers are part of our story. Discover their
            experiences with Sirraha.
          </p>
        </header>

        {/* Reviews carousel */}
        {loading ? (
          <p className="py-12 text-center text-sm text-[#6B5651]">
            Loading customer reviews...
          </p>
        ) : loadError ? (
          <p
            role="alert"
            className="py-10 text-center text-sm text-[#6B5651]"
          >
            {loadError}
          </p>
        ) : reviews.length === 0 ? (
          <div className="mx-auto mb-12 max-w-xl border border-[#E5DDD8] bg-[#FFFFFF] px-6 py-10 text-center">
            <div className="mb-4 flex justify-center">
              <StarRating rating={5} size="text-2xl" />
            </div>

            <h3 className="font-['Cormorant_Garamond'] text-3xl text-[#4B1F1B]">
              Your story belongs here
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#6B5651]">
              Be among the first to share your Sirraha experience.
              Be the first to share your experience with Sirraha.
            </p>
          </div>
        ) : (
          <div className="sirraha-reviews-viewport">
            <div
              className={`sirraha-reviews-track ${
                canAnimate ? "sirraha-reviews-animated" : ""
              }`}
            >
              {[0, 1].map((copy) => (
                <div
                  key={`review-group-${copy}`}
                  className="sirraha-reviews-group"
                  aria-hidden={copy === 1 ? "true" : undefined}
                >
                  {reviews.map((review, index) => (
                    <div
                      key={`${copy}-${review._id || index}`}
                      className="sirraha-review-card"
                    >
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add review button and collapsible customer review form */}
        <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-12">
<button
  type="button"
  onClick={() => {
    setIsReviewFormOpen((previous) => !previous);
    setSubmitError("");
  }}
  aria-expanded={isReviewFormOpen}
  className="
    group
    inline-flex
    min-h-[58px]
    min-w-[280px]
    items-center
    justify-center
    gap-3
    rounded-full
    border
   border-0
    bg-white
    px-9
    py-4
    font-['Poppins',sans-serif]
    text-[12px]
    font-semibold
    uppercase
    tracking-[2px]
    !text-[#351411]
    shadow-[0_8px_24px_rgba(53,20,17,0.12)]
    transition-all
    duration-300
    ease-out
    hover:-translate-y-0.5
    hover:border-[#4B1F1B]
    hover:bg-[#4B1F1B]
    hover:!text-white
    hover:shadow-[0_12px_28px_rgba(53,20,17,0.22)]
    active:translate-y-0
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-[#C8A15A]
  "
>
  <span
    aria-hidden="true"
    className="
      text-[21px]
      font-normal
      leading-none
      !text-[#351411]
      transition-all
      duration-300
      group-hover:rotate-90
      group-hover:!text-white
    "
  >
    {isReviewFormOpen ? "×" : "+"}
  </span>

  <span
    className="
      !text-[#351411]
      transition-colors
      duration-300
      group-hover:!text-white
    "
  >
    {isReviewFormOpen ? "Close Review Form" : "Add a Review"}
  </span>
</button>

        </div>

        {success && (
          <p
            role="status"
            className="mx-auto mt-4 max-w-3xl border border-[#B9D2BD] bg-[#F1F8F1] p-3 text-center text-sm leading-6 text-[#356447]"
          >
            {success}
          </p>
        )}

        {isReviewFormOpen && (
        <div
          id="sirraha-review-form-panel"
          className="mx-auto mt-6 max-w-3xl border border-[#E5DDD8] bg-[#FFFFFF] p-5 sm:mt-8 sm:p-9 lg:p-10"
        >
          <div className="mb-8">
            <p className="font-['Poppins'] text-[10px] font-medium uppercase tracking-[2.5px] text-[#A98243]">
              Your story matters
            </p>

            <h3 className="mt-2 font-['Cormorant_Garamond'] text-3xl text-[#4B1F1B] sm:text-4xl">
              Share your experience
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#6B5651]">
              Share your feedback and, if you like, upload one photo
              of your Sirraha outfit. Your review will be published
              after you submit it.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer name */}
            <div>
              <label
                htmlFor="sirraha-review-name"
                className="mb-2 block text-xs font-medium text-[#351411]"
              >
                Your name
              </label>

              <input
                id="sirraha-review-name"
                name="customerName"
                value={form.customerName}
                onChange={updateField}
                required
                maxLength={60}
                autoComplete="name"
                placeholder="Enter your name"
                className="w-full border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3.5 text-sm text-[#351411] outline-none transition focus:border-[#A98243]"
              />
            </div>

            {/* Rating */}
            <fieldset>
              <legend className="mb-3 block text-xs font-medium text-[#351411]">
                Your rating
              </legend>

              <StarRating
                rating={Number(form.rating)}
                interactive
                onChange={(rating) =>
                  setForm((previous) => ({
                    ...previous,
                    rating,
                  }))
                }
                size="text-3xl"
              />
            </fieldset>

            {/* Review title */}
            <div>
              <label
                htmlFor="sirraha-review-title"
                className="mb-2 block text-xs font-medium text-[#351411]"
              >
                Review title
              </label>

              <input
                id="sirraha-review-title"
                name="title"
                value={form.title}
                onChange={updateField}
                required
                maxLength={100}
                placeholder="Give your review a title"
                className="w-full border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3.5 text-sm text-[#351411] outline-none transition focus:border-[#A98243]"
              />
            </div>

            {/* Optional product name */}
            <div>
              <label
                htmlFor="sirraha-review-product"
                className="mb-2 block text-xs font-medium text-[#351411]"
              >
                Product name (optional)
              </label>

              <input
                id="sirraha-review-product"
                name="productName"
                value={form.productName}
                onChange={updateField}
                maxLength={120}
                placeholder="Which Sirraha piece did you purchase?"
                className="w-full border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3.5 text-sm text-[#351411] outline-none transition focus:border-[#A98243]"
              />
            </div>

            {/* Review message */}
            <div>
              <label
                htmlFor="sirraha-review-message"
                className="mb-2 block text-xs font-medium text-[#351411]"
              >
                Your review
              </label>

              <textarea
                id="sirraha-review-message"
                name="message"
                value={form.message}
                onChange={updateField}
                required
                minLength={10}
                maxLength={1000}
                rows={5}
                placeholder="Tell us about the fabric, fit, quality, or your overall experience..."
                className="w-full resize-y border border-[#E5DDD8] bg-[#FFFFFF] px-4 py-3.5 text-sm leading-7 text-[#351411] outline-none transition focus:border-[#A98243]"
              />

              <p className="mt-2 text-right text-[11px] text-[#918477]">
                {form.message.length}/1000
              </p>
            </div>

            {/* Photo uploads */}
            <div>
              <label
                htmlFor="sirraha-review-photos"
                className="mb-2 block text-xs font-medium text-[#351411]"
              >
                Upload one outfit photo (optional)
              </label>

              <input
                id="sirraha-review-photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-[#6B5651] file:mr-4 file:border-0 file:bg-[#4B1F1B] file:px-4 file:py-3 file:text-xs file:font-medium file:uppercase file:tracking-wider file:text-[#FFFFFF] hover:file:bg-[#351411]"
              />

              <p className="mt-2 text-xs leading-5 text-[#918477]">
                JPG, PNG, or WebP. Maximum file size: 5 MB.
              </p>

              {photoPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                  {photoPreviews.map((src, index) => (
                    <div key={src} className="relative">
                      <img
                        src={src}
                        alt={`Selected review photo ${index + 1}`}
                        className="aspect-square w-full border border-[#E5DDD8] object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        aria-label={`Remove photo ${index + 1}`}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#351411] text-sm text-white shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status messages */}
            {submitError && (
              <p
                role="alert"
                className="text-sm leading-6 text-red-700"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-[#4B1F1B] bg-[#4B1F1B] px-6 py-4 font-['Poppins'] text-xs font-medium uppercase tracking-[2px] text-[#FFFFFF] transition duration-300 hover:border-[#351411] hover:bg-[#351411] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting your review..."
                : "Submit your review"}
            </button>
          </form>
        </div>
        )}
      </div>
    </section>
  );
}

export default ReviewsSection;
