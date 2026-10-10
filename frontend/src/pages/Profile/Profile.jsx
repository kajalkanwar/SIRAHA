import { useNavigate } from "react-router-dom";

import {
  FiUser,
  FiPackage,
  FiMapPin,
  FiLogOut,
  FiChevronRight,
  FiHelpCircle,
} from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const accountOptions = [
    {
      label: "My Orders",
      description:
        "Track your orders and view order history.",
      icon: FiPackage,
      path: "/track-order",
    },
    {
      label: "Saved Addresses",
      description:
        "Manage your delivery addresses.",
      icon: FiMapPin,
      path: "/saved-addresses",
    },
    {
      label: "Account Details",
      description:
        "Update your personal information.",
      icon: FiUser,
      path: "/account-details",
    },
    {
      label: "Help & Support",
      description:
        "Get assistance with your Sirraha experience.",
      icon: FiHelpCircle,
      path: "/track-order",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FAF7F0] text-[#3A2A20]">

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="border-b border-[#DED4C4] bg-[#FAF7F0]">
        <div
          className="
            mx-auto
            w-full
            max-w-6xl
            px-5
            py-10
            sm:px-8
            sm:py-14
            lg:px-12
          "
        >
          <p
            className="
              mb-3
              text-[9px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[#A98243]
              sm:text-[10px]
            "
          >
            Sirraha Account
          </p>

          <h1
            className="
              font-['Cormorant_Garamond']
              text-4xl
              font-normal
              leading-none
              text-[#43231C]
              sm:text-5xl
            "
          >
            My Account
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              font-['Poppins']
              text-[10px]
              leading-6
              text-[#71655B]
              sm:text-[11px]
            "
          >
            Manage your account, orders and saved
            addresses in one place.
          </p>
        </div>
      </section>

      {/* =====================================================
          PROFILE CONTENT
      ===================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-6xl
          px-5
          py-8
          sm:px-8
          sm:py-12
          lg:px-12
          lg:py-14
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-3
            lg:gap-8
          "
        >

          {/* =================================================
              LEFT PROFILE CARD
          ================================================= */}

          <div className="lg:col-span-1">
            <div
              className="
                rounded-xl
                border
                border-[#DED4C4]
                bg-[#FFFDF9]
                p-6
                shadow-[0_8px_30px_rgba(67,35,28,0.035)]
                sm:p-8
              "
            >

              {/* PROFILE ICON */}

              <div
                className="
                  mx-auto
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D8BD83]
                  bg-[#F2EBDD]
                "
              >
                <FiUser
                  className="
                    h-9
                    w-9
                    text-[#5A3026]
                  "
                  strokeWidth={1.25}
                />
              </div>

              {/* NAME */}

              <div className="mt-5 text-center">
                <h2
                  className="
                    font-['Cormorant_Garamond']
                    text-2xl
                    font-normal
                    leading-none
                    text-[#43231C]
                  "
                >
                  {user?.name || "Your Name"}
                </h2>

                <p
                  className="
                    mt-2
                    break-all
                    font-['Poppins']
                    text-[9px]
                    text-[#918477]
                  "
                >
                  {user?.email || "your@email.com"}
                </p>
              </div>

              {/* EDIT PROFILE */}

              <button
                type="button"
                onClick={() =>
                  navigate("/account-details")
                }
                className="
                  mt-7
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#5A3026]
                  bg-transparent
                  px-5
                  font-['Poppins']
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[2px]
                  text-[#5A3026]
                  transition-all
                  duration-300
                  hover:bg-[#5A3026]
                  hover:text-[#FFFDF9]
                "
              >
                Edit Profile
              </button>
            </div>

            {/* DESKTOP SMALL ACCOUNT NOTE */}

            <div
              className="
                mt-5
                hidden
                border-t
                border-[#DED4C4]
                pt-5
                lg:block
              "
            >
              <p
                className="
                  font-['Cormorant_Garamond']
                  text-[15px]
                  italic
                  leading-6
                  text-[#918477]
                "
              >
                Rooted in Indian craft.
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT ACCOUNT OPTIONS
          ================================================= */}

          <div className="lg:col-span-2">

            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-[#DED4C4]
                bg-[#FFFDF9]
                shadow-[0_8px_30px_rgba(67,35,28,0.035)]
              "
            >

              {/* ACCOUNT OPTIONS */}

              {accountOptions.map(
                (option, index) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() =>
                        navigate(option.path)
                      }
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-4
                        p-5
                        text-left
                        transition-all
                        duration-300
                        hover:bg-[#F2EBDD]/65
                        sm:p-6
                        ${
                          index !==
                          accountOptions.length - 1
                            ? "border-b border-[#EAE2D5]"
                            : ""
                        }
                      `}
                    >

                      {/* LEFT SIDE */}

                      <div
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-4
                          sm:gap-5
                        "
                      >

                        {/* ICON */}

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#DED4C4]
                            bg-[#F2EBDD]
                            transition-all
                            duration-300
                            group-hover:border-[#C8A15A]
                            group-hover:bg-[#FFFDF9]
                            sm:h-12
                            sm:w-12
                          "
                        >
                          <Icon
                            className="
                              h-5
                              w-5
                              text-[#5A3026]
                            "
                            strokeWidth={1.3}
                          />
                        </div>

                        {/* TEXT */}

                        <div className="min-w-0">
                          <h3
                            className="
                              font-['Cormorant_Garamond']
                              text-[20px]
                              font-medium
                              leading-none
                              text-[#43231C]
                              sm:text-[21px]
                            "
                          >
                            {option.label}
                          </h3>

                          <p
                            className="
                              mt-1.5
                              max-w-[430px]
                              font-['Poppins']
                              text-[9px]
                              leading-5
                              text-[#918477]
                              sm:text-[10px]
                            "
                          >
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* ARROW */}

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-transparent
                          transition-all
                          duration-300
                          group-hover:border-[#D8BD83]
                          group-hover:bg-[#F2EBDD]
                        "
                      >
                        <FiChevronRight
                          className="
                            h-4
                            w-4
                            text-[#A98243]
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          "
                          strokeWidth={1.25}
                        />
                      </div>
                    </button>
                  );
                }
              )}

              {/* =================================================
                  LOGOUT
              ================================================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-4
                  border-t
                  border-[#DED4C4]
                  p-5
                  text-left
                  transition-all
                  duration-300
                  hover:bg-[#F2EBDD]/65
                  sm:p-6
                "
              >

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-4
                    sm:gap-5
                  "
                >

                  {/* LOGOUT ICON */}

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#DED4C4]
                      bg-[#F2EBDD]
                      transition-all
                      duration-300
                      group-hover:border-[#C8A15A]
                      group-hover:bg-[#FFFDF9]
                      sm:h-12
                      sm:w-12
                    "
                  >
                    <FiLogOut
                      className="
                        h-5
                        w-5
                        text-[#5A3026]
                      "
                      strokeWidth={1.3}
                    />
                  </div>

                  {/* LOGOUT TEXT */}

                  <div>
                    <h3
                      className="
                        font-['Cormorant_Garamond']
                        text-[20px]
                        font-medium
                        leading-none
                        text-[#43231C]
                        sm:text-[21px]
                      "
                    >
                      Logout
                    </h3>

                    <p
                      className="
                        mt-1.5
                        font-['Poppins']
                        text-[9px]
                        leading-5
                        text-[#918477]
                        sm:text-[10px]
                      "
                    >
                      Sign out of your Sirraha account.
                    </p>
                  </div>
                </div>

                {/* LOGOUT ARROW */}

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-transparent
                    transition-all
                    duration-300
                    group-hover:border-[#D8BD83]
                    group-hover:bg-[#F2EBDD]
                  "
                >
                  <FiChevronRight
                    className="
                      h-4
                      w-4
                      text-[#A98243]
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                    strokeWidth={1.25}
                  />
                </div>
              </button>
            </div>

            {/* =================================================
                MOBILE ROOTED LINE
            ================================================= */}

            <div
              className="
                mt-7
                flex
                items-center
                gap-3
                lg:hidden
              "
            >
              <span className="h-px flex-1 bg-[#DED4C4]" />

              <p
                className="
                  font-['Cormorant_Garamond']
                  text-[13px]
                  italic
                  text-[#918477]
                "
              >
                Rooted in Indian craft.
              </p>

              <span className="h-px flex-1 bg-[#DED4C4]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;