
import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

const uploadReviewPhoto = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "sirraha/reviews",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);

        if (!result) {
          return reject(new Error("Cloudinary returned no image result."));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    Readable.from(file.buffer).pipe(stream);
  });

export default uploadReviewPhoto;
