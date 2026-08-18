import { Link } from "react-router-dom";
import { categories } from "../../constants/categories";

function Categories() {
  return (
    <section className="w-full bg-[#F8F4EC] pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 lg:pb-16">

      {/* ================= SECTION HEADER ================= */}
      <div className="w-full text-center px-4 sm:px-6 lg:px-8 mb-7 sm:mb-9 lg:mb-11">

        {/* Explore */}
        <p className="
          text-[#0E5B3B]
          uppercase
          tracking-[4px]
          sm:tracking-[5px]
          text-[10px]
          sm:text-xs
          mb-3
          sm:mb-4
        ">
          Explore
        </p>

        {/* Heading */}
        <h2 className="
          text-4xl
          sm:text-5xl
          md:text-6xl
          lg:text-7xl
          leading-none
          font-normal
          text-[#222]
        ">
          Shop By Category
        </h2>

        {/* Description */}
        <p className="
          mt-4
          sm:mt-5
          mx-auto
          w-full
          text-center
          text-sm
          sm:text-base
          lg:text-lg
          text-gray-600
          leading-6
          sm:leading-7
          lg:whitespace-nowrap
        ">
          Discover thoughtfully crafted pieces designed for effortless Indian elegance.
        </p>

      </div>


      {/* ================= CATEGORY GRID ================= */}
      <div className="w-full px-2 sm:px-4 md:px-5 lg:px-6">

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-3
          sm:gap-4
          lg:gap-5
          w-full
        ">

          {categories.map((category) => (

            <Link
              key={category.id}
              to={category.path || "#"}
              className="
                group
                relative
                block
                w-full
                overflow-hidden
              "
            >

              {/* Image */}
              <div className="
                relative
                w-full
                aspect-[4/5]
                sm:aspect-[4/5]
                lg:aspect-[3/4]
                overflow-hidden
              ">

                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div className="
                  absolute
                  inset-0
                  bg-black/10
                  group-hover:bg-black/25
                  transition-all
                  duration-500
                " />

                {/* Card Text */}
                <div className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-3
                  sm:p-4
                  md:p-5
                  lg:p-6
                ">

                  <h3 className="
                    text-white
                    font-serif
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    lg:text-4xl
                    leading-tight
                    drop-shadow-md
                  ">
                    {category.name}
                  </h3>

                  <p className="
                    mt-1
                    sm:mt-1.5
                    text-white
                    uppercase
                    tracking-[2px]
                    sm:tracking-[3px]
                    text-[9px]
                    sm:text-[10px]
                    md:text-xs
                    font-medium
                  ">
                    Shop Now
                  </p>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Categories;