import sirrahaFabric from "../../assets/images/sirraha-fabric.jpg";

function CraftedSection() {
  return (
    <section className="w-full m-0 p-0 bg-[#43231C]">
      <div
        className="
          grid
          w-full
          grid-cols-1
          lg:grid-cols-2
        "
      >
        {/* =====================================================
            LEFT — TEXT
        ====================================================== */}
        <div
          className="
            flex
            min-h-[330px]
            items-center
            bg-[#43231C]
            px-7
            py-12
            sm:min-h-[360px]
            sm:px-10
            sm:py-14
            md:px-14
            lg:min-h-[430px]
            lg:px-16
            lg:py-16
            xl:min-h-[460px]
            xl:px-20
          "
        >
          <div className="w-full max-w-[600px]">
            {/* Small label */}
            <div
              className="
                mb-5
                flex
                items-center
                gap-3
                sm:mb-6
              "
            >
              <span
                className="
                  h-px
                  w-8
                  shrink-0
                  bg-[#D8BD83]
                  sm:w-10
                "
              />

              <span
                className="
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[2.8px]
                  text-[#D8BD83]
                  sm:text-[9px]
                  sm:tracking-[3.2px]
                "
              >
                Crafted With Intention
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                max-w-[520px]
                font-['Cormorant_Garamond']
                text-[39px]
                font-normal
                leading-[0.94]
                tracking-[-0.5px]
                text-[#FFFDF9]
                sm:text-[46px]
                md:text-[50px]
                lg:text-[48px]
                xl:text-[54px]
              "
            >
              Rooted in craft.
              <br />
              Made for everyday
              <br />
              elegance.
            </h2>

            {/* Gold divider */}
            <div
              className="
                mt-6
                h-px
                w-10
                bg-[#C8A15A]
                sm:mt-7
                sm:w-12
              "
            />

            {/* Description */}
            <p
              className="
                mt-3
                max-w-[500px]
                font-['Poppins']
                text-[10px]
                font-normal
                leading-[1.8]
                text-[#E8D9C3]
                sm:mt-4
                sm:text-[11px]
                sm:leading-[1.9]
                md:text-[12px]
              "
            >
              Thoughtfully crafted pieces designed for comfort, refined
              through Indian artistry and made for the rhythm of everyday
              life.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT — FABRIC IMAGE
        ====================================================== */}
        <div
          className="
            relative
            min-h-[270px]
            w-full
            overflow-hidden
            sm:min-h-[330px]
            md:min-h-[380px]
            lg:min-h-[430px]
            xl:min-h-[460px]
          "
        >
          <img
            src={sirrahaFabric}
            alt="Sirraha craftsmanship and fabric details"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              object-center
            "
          />

          {/* Very subtle image overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[#2B1B16]/10
            "
          />
        </div>
      </div>
    </section>
  );
}

export default CraftedSection;