import story1 from "../../assets/images/story-1.jpg";
import story2 from "../../assets/images/story-2.jpg";

function OurPromise() {
  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[#FAF7F0]
        text-[#3A2A20]
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1400px]
          grid-cols-1
          gap-10
          px-5
          py-14
          sm:px-8
          sm:py-16
          md:px-10
          md:py-18
          lg:grid-cols-[0.9fr_1.1fr]
          lg:items-center
          lg:gap-12
          lg:px-12
          lg:py-20
          xl:gap-16
          xl:px-16
          xl:py-24
        "
      >
        {/* =====================================================
            LEFT — TEXT
        ===================================================== */}

        <div
          className="
            max-w-[570px]
            lg:pl-2
            xl:pl-4
          "
        >
          {/* Small label */}

          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-[#C8A15A]" />

            <p
              className="
                font-['Poppins']
                text-[8px]
                font-medium
                uppercase
                tracking-[3px]
                text-[#A98243]
                sm:text-[9px]
                sm:tracking-[3.5px]
              "
            >
              The Sirraha Way
            </p>
          </div>

          {/* Heading */}

          <h2
            className="
              max-w-[560px]
              font-['Cormorant_Garamond']
              text-[42px]
              font-normal
              leading-[0.95]
              tracking-[-0.7px]
              text-[#43231C]
              sm:text-[48px]
              md:text-[52px]
              lg:text-[54px]
              xl:text-[58px]
            "
          >
            Rooted in craft.
            <br />

            <span className="italic">
              Made for everyday elegance.
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-[510px]
              font-['Poppins']
              text-[11px]
              font-normal
              leading-[1.85]
              text-[#71655B]
              sm:mt-6
              sm:text-[12px]
              md:text-[13px]
              lg:text-[14px]
              lg:leading-[1.9]
            "
          >
            Thoughtfully designed pieces made for the
            way you live. Comfortable silhouettes,
            refined details and timeless Indian
            craftsmanship come together to create
            clothing you can wear beautifully, every day.
          </p>

          {/* Gold divider */}

          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C8A15A] sm:w-12" />

            <span className="text-[8px] text-[#C8A15A]">
              ✦
            </span>

            <span className="h-px w-10 bg-[#C8A15A] sm:w-12" />
          </div>
        </div>

        {/* =====================================================
            RIGHT — IMAGE COMPOSITION
        ===================================================== */}

        <div
          className="
            relative
            mx-auto
            h-[330px]
            w-full
            max-w-[620px]
            sm:h-[390px]
            md:h-[430px]
            lg:h-[430px]
            xl:h-[470px]
          "
        >
          {/* IMAGE 1 */}

          <div
            className="
              absolute
              left-0
              top-0
              h-[70%]
              w-[48%]
              overflow-hidden
              bg-[#F2EBDD]
            "
          >
            <img
              src={story1}
              alt="Sirraha craftsmanship and tailoring"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                hover:scale-[1.025]
              "
            />
          </div>

          {/* IMAGE 2 */}

          <div
            className="
              absolute
              bottom-0
              right-0
              h-[70%]
              w-[48%]
              overflow-hidden
              bg-[#F2EBDD]
            "
          >
            <img
              src={story2}
              alt="Sirraha collection"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                hover:scale-[1.025]
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurPromise;