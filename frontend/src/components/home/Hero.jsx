import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import heroImage from "../../assets/images/hero2.jpg";
import hero2Image from "../../assets/images/hero1.jpg";
import hero3Image from "../../assets/images/hero3.jpg";
import hero4Image from "../../assets/images/hero4.jpg";

// ============================================================
// SIRRAHA HERO SLIDES
// ============================================================

const slides = [
  {
    id: 1,
    image: heroImage,
    objectPosition: "center center",

    eyebrow: "The New Everyday Edit",

    title: (
      <>
        Clothes that feel
        <br />
        like home.
      </>
    ),

    description:
      "Thoughtfully crafted Indian silhouettes made for everyday ease, comfort and elegance.",

    textPosition: "left",
  },

  {
    id: 2,
    image: hero2Image,
    objectPosition: "center center",

    eyebrow: "The Farshi Edit",

    title: (
      <>
        Tradition,
        <br />
        with a softer
        <br />
        rhythm.
      </>
    ),

    description:
      "Graceful silhouettes made to bring timeless Indian elegance into everyday moments.",

    textPosition: "left-lower",
  },

  {
    id: 3,
    image: hero3Image,
    objectPosition: "center center",

    eyebrow: "Sirraha Co-ords",

    title: (
      <>
        Relaxed fits
        <br />
        for real days.
      </>
    ),

    description:
      "Comfortable, effortless and always elegant — made to move with you.",

    textPosition: "left-center",
  },

  {
    id: 4,
    image: hero4Image,
    objectPosition: "center center",

    eyebrow: "The Halter Edit",

    title: (
      <>
        Made for
        <br />
        effortless days.
      </>
    ),

    description:
      "Easy cotton silhouettes with just enough statement to stand apart.",

    textPosition: "right",
  },
];

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  const [isPaused, setIsPaused] = useState(false);

  // ==========================================================
  // AUTOMATIC SLIDESHOW
  // Changes every 5 seconds
  // ==========================================================

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setActiveSlide(
        (previousSlide) =>
          (previousSlide + 1) % slides.length
      );
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  // ==========================================================
  // PREVIOUS
  // ==========================================================

  const goToPrevious = () => {
    setActiveSlide((previousSlide) => {
      if (previousSlide === 0) {
        return slides.length - 1;
      }

      return previousSlide - 1;
    });
  };

  // ==========================================================
  // NEXT
  // ==========================================================

  const goToNext = () => {
    setActiveSlide(
      (previousSlide) =>
        (previousSlide + 1) % slides.length
    );
  };

  // ==========================================================
  // GO TO SLIDE
  // ==========================================================

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#3A2A20]

        h-[476px]

        sm:h-[510px]

        md:h-[560px]

        lg:h-[530px]

        xl:h-[550px]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ======================================================
          SLIDES
      ====================================================== */}

      {slides.map((slide, index) => {
        const isActive = index === activeSlide;

        return (
          <div
            key={slide.id}
            className={`
              absolute
              inset-0
              overflow-hidden

              transition-opacity
              duration-[1200ms]
              ease-in-out

              ${
                isActive
                  ? "z-[2] opacity-100"
                  : "z-[1] opacity-0"
              }
            `}
          >
            {/* ==================================================
                IMAGE
            ================================================== */}

            <img
              src={slide.image}
              alt="Sirraha clothing collection"
              className={`
                absolute
                inset-0

                h-full
                w-full

                object-cover

                transition-transform
                duration-[6000ms]
                ease-out

                ${
                  isActive
                    ? "scale-[1.025]"
                    : "scale-100"
                }
              `}
              style={{
                objectPosition:
                  slide.objectPosition,
              }}
            />

            {/* ==================================================
                VERY LIGHT OVERLAY
            ================================================== */}

            <div
              className="
                absolute
                inset-0

                bg-black/[0.035]
              "
            />

            {/* ==================================================
                TEXT READABILITY GRADIENT
            ================================================== */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-r
                from-[#241711]/50
                via-[#241711]/16
                to-transparent
              "
            />

            {/* ==================================================
                TEXT CONTENT
            ================================================== */}

            <div
              className={`
                absolute
                inset-0
                z-[10]

                flex

                ${
                  slide.textPosition === "right"
                    ? "items-center justify-end"
                    : slide.textPosition ===
                      "left-lower"
                    ? "items-end"
                    : "items-center"
                }
              `}
            >
              <div
                className="
                  mx-auto
                  w-full
                  max-w-[1400px]

                  px-5

                  sm:px-8

                  md:px-10

                  lg:px-14

                  xl:px-20
                "
              >
                <div
                  className={`
                    relative
                    max-w-[345px]

                    sm:max-w-[430px]

                    md:max-w-[500px]

                    lg:max-w-[570px]

                    ${
                      slide.textPosition ===
                      "right"
                        ? "ml-auto text-right"
                        : slide.textPosition ===
                          "left-lower"
                        ? "pb-12 sm:pb-16 md:pb-20"
                        : ""
                    }
                  `}
                >
                  {/* ==================================================
                      EYEBROW
                  ================================================== */}

                  <div
                    className={`
                      mb-3

                      flex
                      items-center
                      gap-3

                      sm:mb-4

                      ${
                        slide.textPosition ===
                        "right"
                          ? "justify-end"
                          : ""
                      }
                    `}
                  >
                    <span
                      className="
                        h-px
                        w-6

                        bg-[#D8BD83]

                        sm:w-8
                      "
                    />

                    <p
                      className="
                        font-['Poppins']

                        text-[7px]
                        font-medium

                        uppercase
                        tracking-[2.5px]

                        text-[#D8BD83]

                        sm:text-[8px]
                        sm:tracking-[3px]

                        md:text-[9px]
                      "
                    >
                      {slide.eyebrow}
                    </p>
                  </div>

                  {/* ==================================================
                      HEADING
                  ================================================== */}

                  <h1
                    className={`
                      font-['Cormorant_Garamond']

                      font-normal

                      tracking-[-0.7px]

                      text-[#FFFDF9]

                      ${
                        slide.id === 1
                          ? `
                            max-w-[350px]

                            text-[42px]
                            leading-[0.91]

                            sm:max-w-[430px]
                            sm:text-[50px]
                            sm:leading-[0.93]

                            md:text-[58px]

                            lg:max-w-[560px]
                            lg:text-[68px]
                            lg:leading-[0.95]

                            xl:text-[74px]
                          `
                          : slide.id === 2
                          ? `
                            max-w-[310px]

                            text-[38px]
                            leading-[0.94]

                            sm:max-w-[390px]
                            sm:text-[47px]

                            md:text-[55px]

                            lg:text-[64px]

                            xl:text-[70px]
                          `
                          : slide.id === 3
                          ? `
                            max-w-[350px]

                            text-[40px]
                            leading-[0.92]

                            sm:max-w-[430px]
                            sm:text-[50px]

                            md:text-[58px]

                            lg:text-[68px]

                            xl:text-[74px]
                          `
                          : `
                            max-w-[320px]

                            text-[38px]
                            leading-[0.93]

                            sm:max-w-[400px]
                            sm:text-[48px]

                            md:text-[56px]

                            lg:text-[66px]

                            xl:text-[72px]
                          `
                      }
                    `}
                  >
                    {slide.title}
                  </h1>

                  {/* ==================================================
                      DESCRIPTION
                  ================================================== */}

                  <p
                    className={`
                      mt-4

                      font-['Poppins']

                      text-[9px]

                      leading-[1.7]

                      text-[#FFFDF9]/90

                      sm:mt-5
                      sm:text-[10px]
                      sm:leading-[1.8]

                      md:text-[12px]

                      lg:mt-6
                      lg:text-[13px]
                      lg:leading-6

                      ${
                        slide.textPosition ===
                        "right"
                          ? "ml-auto max-w-[360px]"
                          : "max-w-[430px]"
                      }
                    `}
                  >
                    {slide.description}
                  </p>

                  {/* ==================================================
                      SHOP THE COLLECTION

                      ONLY ON FIRST HERO IMAGE

                      Capsule / cylindrical shape
                  ================================================== */}

                  {slide.id === 1 && (
                    <Link
                      to="/collection"
                      className="
                        group

                        mt-6

                        inline-flex

                        min-h-[46px]

                        items-center
                        justify-center

                        rounded-full

                        border
                        border-[#F3E5C6]/75

                        bg-[#C8A15A]/90

                        px-8

                        font-['Poppins']

                        text-[8px]

                        font-semibold

                        uppercase

                        tracking-[2.5px]

                        text-[#3A2A20]

                        shadow-[0_12px_35px_rgba(36,23,17,0.25)]

                        backdrop-blur-xl

                        transition-all
                        duration-300

                        hover:border-[#F8EBD0]

                        hover:bg-[#D8BD83]

                        hover:shadow-[0_15px_40px_rgba(36,23,17,0.30)]

                        sm:min-h-[50px]

                        sm:px-10

                        sm:text-[9px]

                        md:min-h-[52px]

                        md:px-11

                        lg:mt-7

                        lg:min-h-[54px]

                        lg:px-12

                        lg:text-[10px]

                        lg:tracking-[2.8px]
                      "
                    >
                      <span>
                        Shop The Collection
                      </span>

                      <span
                        className="
                          ml-3

                          flex
                          h-6
                          w-6

                          items-center
                          justify-center

                          rounded-full

                          border
                          border-[#3A2A20]/20
                        "
                      >
                        <FiChevronRight
                          size={13}
                          strokeWidth={1.4}
                          className="
                            transition-transform
                            duration-300

                            group-hover:translate-x-0.5
                          "
                        />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ======================================================
          DESKTOP PREVIOUS BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous hero slide"
        className="
          absolute

          left-5
          top-1/2

          z-[25]

          hidden

          h-10
          w-10

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-[#FFFDF9]/35

          bg-[#FFFDF9]/10

          text-[#FFFDF9]

          backdrop-blur-md

          transition-all
          duration-300

          hover:border-[#D8BD83]

          hover:bg-[#5A3026]/65

          lg:flex

          xl:left-8
        "
      >
        <FiChevronLeft
          size={18}
          strokeWidth={1.2}
        />
      </button>

      {/* ======================================================
          DESKTOP NEXT BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next hero slide"
        className="
          absolute

          right-5
          top-1/2

          z-[25]

          hidden

          h-10
          w-10

          -translate-y-1/2

          items-center
          justify-center

          rounded-full

          border
          border-[#FFFDF9]/35

          bg-[#FFFDF9]/10

          text-[#FFFDF9]

          backdrop-blur-md

          transition-all
          duration-300

          hover:border-[#D8BD83]

          hover:bg-[#5A3026]/65

          lg:flex

          xl:right-8
        "
      >
        <FiChevronRight
          size={18}
          strokeWidth={1.2}
        />
      </button>

      {/* ======================================================
          SLIDE INDICATORS
      ====================================================== */}

      <div
        className="
          absolute

          bottom-4
          left-1/2

          z-[25]

          flex

          -translate-x-1/2

          items-center
          gap-1.5

          sm:bottom-5
          sm:gap-2
        "
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to hero slide ${
              index + 1
            }`}
            className={`
              h-[2px]

              rounded-full

              transition-all
              duration-500

              ${
                index === activeSlide
                  ? "w-8 bg-[#D8BD83]"
                  : "w-4 bg-[#FFFDF9]/70"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;