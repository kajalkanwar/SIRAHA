
import { FiInstagram } from "react-icons/fi";

// ============================================================
// SIRRAHA CUSTOMER GALLERY
// ============================================================

// Replace these image URLs with your actual customer photos.
// Each photo links to Sirraha's Instagram profile or post.

const customerPhotos = [
  {
    id: 1,
    image: "/images/customers/customer-1.jpg",
    alt: "Sirraha customer wearing an ethnic outfit",
    postUrl: "https://www.instagram.com/",
  },
  {
    id: 2,
    image: "/images/customers/customer-2.jpg",
    alt: "Customer styling her favourite Sirraha outfit",
    postUrl: "https://www.instagram.com/",
  },
  {
    id: 3,
    image: "/images/customers/customer-3.jpg",
    alt: "Sirraha customer in traditional clothing",
    postUrl: "https://www.instagram.com/",
  },
  {
    id: 4,
    image: "/images/customers/customer-4.jpg",
    alt: "Customer sharing her Sirraha look",
    postUrl: "https://www.instagram.com/",
  },
  {
    id: 5,
    image: "/images/customers/customer-5.jpg",
    alt: "Customer styling an elegant ethnic look",
    postUrl: "https://www.instagram.com/",
  },
  {
    id: 6,
    image: "/images/customers/customer-6.jpg",
    alt: "Sirraha customer wearing a favourite outfit",
    postUrl: "https://www.instagram.com/",
  },
];

// IMPORTANT:
// Replace this with the actual Sirraha Instagram username.
// Example: https://www.instagram.com/yourbrandusername/

const INSTAGRAM_URL = "https://www.instagram.com/sirrahafashion/";

function CustomerGallery() {
  return (
    <section
      aria-labelledby="customer-gallery-heading"
      className="w-full bg-[#EEEEEE] px-2.5 py-2.5 sm:px-4 sm:py-4"
    >
      {/* WHITE INNER SECTION */}

      <div
        className="
          mx-auto w-full bg-white
          px-4 py-10
          sm:px-7 sm:py-12
          md:px-10 md:py-14
          lg:px-12 lg:py-16
          xl:px-16 xl:py-[72px]
        "
      >
        {/* HEADING */}

        <div className="text-center">
          <h2
            id="customer-gallery-heading"
            className="
              font-['Poppins',sans-serif]
              text-[19px] font-semibold
              uppercase leading-tight
              tracking-[2px]
              text-[#4B1F1B]
              sm:text-[24px]
              sm:tracking-[3px]
              md:text-[30px]
              lg:text-[34px]
            "
          >
            Our Beautiful Customers
          </h2>

          <p
            className="
              mt-3
              font-['Poppins',sans-serif]
              text-[13px]
              text-[#79504B]
              sm:mt-4
              sm:text-[15px]
              md:text-[17px]
            "
          >
            Tag us{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-medium
                underline-offset-4
                transition-colors
                hover:text-[#A98243]
                hover:underline
              "
            >
              @sirrahafashion
            </a>
          </p>
        </div>

        {/* CUSTOMER PHOTO GRID */}

        <div
          className="
            mx-auto mt-8 grid
            max-w-[1500px]
            grid-cols-2 gap-3
            sm:mt-10
            sm:grid-cols-3 sm:gap-3.5
            md:mt-12
            md:grid-cols-3 md:gap-4
            lg:grid-cols-6 lg:gap-3.5
            xl:gap-4
          "
        >
          {customerPhotos.map((photo) => (
            <a
              key={photo.id}
              href={photo.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Instagram post: ${photo.alt}`}
              className="
                group relative block
                aspect-square overflow-hidden
                rounded-[9px]
                bg-[#F3EEEA]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#C8A15A]
              "
            >
              {/* CUSTOMER IMAGE */}

              <img
                src={photo.image}
                alt={photo.alt}
                loading="lazy"
                className="
                  h-full w-full
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-[1.06]
                "
                onError={(event) => {
                  // Show a neutral placeholder if an image
                  // has not been added yet.
                  event.currentTarget.style.visibility = "hidden";
                }}
              />

              {/* HOVER OVERLAY */}

              <span
                aria-hidden="true"
                className="
                  absolute inset-0
                  flex items-center justify-center
                  bg-[#351411]/0
                  transition-colors duration-300
                  group-hover:bg-[#351411]/45
                  group-focus-visible:bg-[#351411]/45
                "
              >
                <FiInstagram
                  size={35}
                  strokeWidth={1.8}
                  className="
                    text-white
                    opacity-0
                    transition-all duration-300
                    group-hover:scale-100
                    group-hover:opacity-100
                    group-focus-visible:opacity-100
                  "
                />
              </span>
            </a>
          ))}
        </div>


{/* FOLLOW US BUTTON */}
<div className="mt-8 flex justify-center sm:mt-10">
  <a
    href={INSTAGRAM_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Follow Sirraha on Instagram"
    className="
      group
      relative
      inline-flex
      min-h-[52px]
      min-w-[230px]
      items-center
      justify-center
      gap-3
      overflow-hidden
      rounded-full
      border
      border-[#F1ECE9]
      bg-white
      px-8
      py-3.5
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
      hover:-translate-y-1
      hover:border-[#E5DDD8]
      hover:bg-[#4B1F1B]
      hover:!text-white
      hover:shadow-[0_14px_30px_rgba(53,20,17,0.22)]
      active:translate-y-0
      active:scale-[0.98]
      focus-visible:outline
      focus-visible:outline-2
      focus-visible:outline-offset-4
      focus-visible:outline-[#C8A15A]
      sm:min-h-[56px]
      sm:min-w-[252px]
      sm:text-[13px]
    "
  >
    {/* SUBTLE HOVER SHINE */}
    <span
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        -translate-x-[130%]
        skew-x-[-20deg]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-transform
        duration-700
        ease-out
        group-hover:translate-x-[130%]
      "
    />

    {/* INSTAGRAM ICON */}
    <FiInstagram
      size={24}
      strokeWidth={1.8}
      aria-hidden="true"
      className="
        relative
        z-10
        shrink-0
        !text-[#351411]
        transition-all
        duration-300
        group-hover:rotate-[-8deg]
        group-hover:scale-110
        group-hover:!text-white
      "
    />

    {/* BUTTON TEXT */}
    <span
      className="
        relative
        z-10
        !text-[#351411]
        transition-colors
        duration-300
        group-hover:!text-white
      "
    >
      Follow Us
    </span>
  </a>
</div>

      </div>
    </section>
  );
}

export default CustomerGallery;
