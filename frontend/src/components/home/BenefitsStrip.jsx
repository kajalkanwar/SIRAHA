import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiLock,
} from "react-icons/fi";

const benefits = [
  {
    title: "Thoughtful Delivery",
    description: "Packed with care, shipped across India",
    icon: FiTruck,
  },
  {
    title: "Made To Last",
    description: "Quality fabrics, considered details",
    icon: FiShield,
  },
  {
    title: "Easy Exchanges",
    description: "A little more time to get it right",
    icon: FiRefreshCw,
  },
  {
    title: "Secure Checkout",
    description: "Safe and protected payment",
    icon: FiLock,
  },
];

function BenefitsStrip() {
  return (
    <section
      className="
        hidden
        w-full
        border-b
        border-[#E5DDD8]/70
        bg-[#FFFFFF]/70
        backdrop-blur-md

        lg:block
      "
    >
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1350px]
          grid-cols-4
        "
      >
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className={`
                flex
                min-h-[82px]
                items-center
                gap-3
                px-5
                py-3

                xl:px-7

                ${
                  index !== 3
                    ? "border-r border-[#E5DDD8]/70"
                    : ""
                }
              `}
            >
              {/* =================================================
                  ICON
              ================================================= */}

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#C8A15A]/40
                  bg-[#FFFFFF]/70
                  text-[#A98243]

                  xl:h-10
                  xl:w-10
                "
              >
                <Icon
                  size={15}
                  strokeWidth={1.2}
                />
              </div>

              {/* =================================================
                  TEXT
              ================================================= */}

              <div className="min-w-0">
                <h3
                  className="
                    font-['Cormorant_Garamond']
                    text-[11px]
                    font-semibold
                    uppercase
                    leading-none
                    tracking-[1.4px]
                    text-[#4B1F1B]

                    xl:text-[12px]
                  "
                >
                  {benefit.title}
                </h3>

                <p
                  className="
                    mt-1
                    truncate
                    font-['Poppins']
                    text-[7px]
                    leading-4
                    text-[#6B5651]

                    xl:text-[8px]
                  "
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BenefitsStrip;