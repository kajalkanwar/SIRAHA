
import Review from "../models/Review.js";
import uploadReviewPhoto from "../utils/uploadReviewPhoto.js";
import cloudinary from "../config/cloudinary.js";

// ============================================================
// GET REVIEWS
// Public: display all reviews immediately.
// ============================================================

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .select(
        "customerName rating title message productName photos isVerifiedPurchase createdAt"
      )
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load customer reviews.",
    });
  }
};

// ============================================================
// CREATE REVIEW
// Public: customers can submit reviews.
// Reviews become visible immediately.
// ============================================================

export const createReview = async (req, res) => {
  const uploadedPhotos = [];

  try {
    const customerName = String(req.body.customerName || "").trim();
    const title = String(req.body.title || "").trim();
    const message = String(req.body.message || "").trim();
    const rating = Number(req.body.rating);
    const productName = String(req.body.productName || "").trim();

    if (!customerName || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, review title, and review message are required.",
      });
    }

    if (customerName.length > 60 || title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name or review title is too long.",
      });
    }

    if (productName.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Product name is too long.",
      });
    }

    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review must contain between 10 and 1000 characters.",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please select a rating from 1 to 5 stars.",
      });
    }

    const files = req.files || [];

    if (files.length > 3) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 3 photos.",
      });
    }

    for (const file of files) {
      const photo = await uploadReviewPhoto(file);
      uploadedPhotos.push(photo);
    }

    const review = await Review.create({
      customerName,
      rating,
      title,
      message,
      productName,
      photos: uploadedPhotos,
      isApproved: true,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your review has been published.",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    // Clean up uploaded photos if review creation fails.
    await Promise.allSettled(
      uploadedPhotos.map((photo) =>
        cloudinary.uploader.destroy(photo.publicId)
      )
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit your review. Please try again.",
    });
  }
};

// ============================================================
// DELETE REVIEW
// Admin only: delete an inappropriate review.
// Protect this route using your existing admin middleware.
// ============================================================

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Delete the database record first. A Cloudinary failure
    // should not prevent an inappropriate review from being removed.
    await Review.findByIdAndDelete(id);

    const photoCleanup = await Promise.allSettled(
      (review.photos || []).map((photo) =>
        photo.publicId
          ? cloudinary.uploader.destroy(photo.publicId)
          : Promise.resolve()
      )
    );

    const failedPhotoDeletes = photoCleanup.filter(
      (result) => result.status === "rejected"
    );

    if (failedPhotoDeletes.length > 0) {
      console.error(
        `${failedPhotoDeletes.length} review photo(s) could not be deleted from Cloudinary.`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete the review. Please try again.",
    });
  }
};
