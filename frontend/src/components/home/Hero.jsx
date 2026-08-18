import heroImage from "../../assets/images/hero.jpg";

function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-130px)] min-h-[650px] overflow-hidden">

      {/* Hero Image */}
      <img
        src={heroImage}
        alt="Sirraha Hero"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Hero Content */}
      <div className="absolute inset-0">

        <div
          className="
            absolute
            left-[14%]
            top-1/2
            -translate-y-1/2
            w-[520px]
            max-w-[40%]
          "
        >

          {/* Small Heading */}
          <p
            className="
              text-[#D9B25C]
              uppercase
              tracking-[5px]
              text-xs
              mb-6
            "
          >
            THE FESTIVE EDIT
          </p>

          {/* Main Heading */}
          <h1
            className="
              text-white
              font-serif
              font-normal
              text-[58px]
              leading-[1.08]
              tracking-[-1px]
            "
          >
            Quiet luxury, rooted
            <br />
            in Indian craft
          </h1>

          {/* Description */}
          <p
            className="
              text-white
              mt-8
              text-[16px]
              leading-7
              max-w-[600px]
            "
          >
            Straight kurta sets, anarkalis and co-ords cut from handloom silks
            and cottons — made in runs of fifty, never more.
          </p>

          {/* CTA */}
          <button
            className="
              mt-9
              bg-[#C9A24A]
              hover:bg-[#b89037]
              transition
              px-12
              py-4
              uppercase
              tracking-[4px]
              text-black
              text-sm
              font-medium
            "
          >
            Shop The Collection
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;