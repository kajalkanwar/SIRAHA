import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2937]">

      {/* ================= PROFILE HEADER ================= */}

      <section className="border-b border-[#E5E0D6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">

          <p className="text-[#0E5B3B] text-[11px] tracking-[0.35em] uppercase mb-3">
            SIRRAHA ACCOUNT
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl text-[#0E5B3B]">
            My Profile
          </h1>

          <p className="mt-3 text-[#64748B] text-sm sm:text-base">
            Manage your account, orders and preferences.
          </p>

        </div>
      </section>


      {/* ================= PROFILE CONTENT ================= */}

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-14">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          {/* ================= LEFT PROFILE CARD ================= */}

          <div className="lg:col-span-1">

            <div className="bg-white/40 border border-[#E5E0D6] p-7 sm:p-8">

              {/* PROFILE ICON */}

              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#EFE9DE] mx-auto">
                <FiUser className="w-9 h-9 text-[#0E5B3B]" />
              </div>


              {/* NAME */}

              <div className="text-center mt-5">

                <h2 className="font-serif text-2xl text-[#0E5B3B]">
  {user?.name || "Your Name"}
</h2>

<p className="text-sm text-[#64748B] mt-1">
  {user?.email || "your@email.com"}
</p>

              </div>


              {/* EDIT PROFILE */}

              <button
                type="button"
                className="
                  w-full
                  mt-7
                  border
                  border-[#0E5B3B]
                  py-3
                  text-[#0E5B3B]
                  text-sm
                  tracking-[0.15em]
                  uppercase
                  hover:bg-[#0E5B3B]
                  hover:text-white
                  transition
                "
              >
                Edit Profile
              </button>

            </div>

          </div>


          {/* ================= RIGHT OPTIONS ================= */}

          <div className="lg:col-span-2">

            <div className="border border-[#E5E0D6] bg-white/30">


              {/* ORDERS */}

              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-6
                  sm:p-7
                  border-b
                  border-[#E5E0D6]
                  hover:bg-[#F1ECE3]
                  transition
                  text-left
                "
              >

                <div className="flex items-center gap-5">

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DE]">
                    <FiPackage className="w-5 h-5 text-[#0E5B3B]" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      My Orders
                    </h3>

                    <p className="text-sm text-[#64748B] mt-1">
                      Track your orders and view order history.
                    </p>
                  </div>

                </div>

                <FiChevronRight className="w-5 h-5 text-[#64748B]" />

              </button>


              {/* WISHLIST */}

              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-6
                  sm:p-7
                  border-b
                  border-[#E5E0D6]
                  hover:bg-[#F1ECE3]
                  transition
                  text-left
                "
              >

                <div className="flex items-center gap-5">

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DE]">
                    <FiHeart className="w-5 h-5 text-[#0E5B3B]" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      Wishlist
                    </h3>

                    <p className="text-sm text-[#64748B] mt-1">
                      View the styles you saved for later.
                    </p>
                  </div>

                </div>

                <FiChevronRight className="w-5 h-5 text-[#64748B]" />

              </button>


              {/* ADDRESSES */}

              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-6
                  sm:p-7
                  border-b
                  border-[#E5E0D6]
                  hover:bg-[#F1ECE3]
                  transition
                  text-left
                "
              >

                <div className="flex items-center gap-5">

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DE]">
                    <FiMapPin className="w-5 h-5 text-[#0E5B3B]" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      Saved Addresses
                    </h3>

                    <p className="text-sm text-[#64748B] mt-1">
                      Manage your delivery addresses.
                    </p>
                  </div>

                </div>

                <FiChevronRight className="w-5 h-5 text-[#64748B]" />

              </button>


              {/* ACCOUNT SETTINGS */}

              <button
                type="button"
                onClick={() => navigate("/account-details")}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  p-6
                  sm:p-7
                  border-b
                  border-[#E5E0D6]
                  hover:bg-[#F1ECE3]
                  transition
                  text-left
                "
              >

                <div className="flex items-center gap-5">

                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DE]">
                    <FiUser className="w-5 h-5 text-[#0E5B3B]" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium">
                      Account Details
                    </h3>

                    <p className="text-sm text-[#64748B] mt-1">
                      Update your personal information.
                    </p>
                  </div>

                </div>

                <FiChevronRight className="w-5 h-5 text-[#64748B]" />

              </button>


              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                
                className="
                  w-full
                  flex
                  items-center
                  gap-5
                  p-6
                  sm:p-7
                  text-left
                  hover:bg-[#F1ECE3]
                  transition
                "
              >

                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EFE9DE]">
                  <FiLogOut className="w-5 h-5 text-[#0E5B3B]" />
                </div>

                <div>
                  <h3 className="text-base font-medium">
                    Logout
                  </h3>

                  <p className="text-sm text-[#64748B] mt-1">
                    Sign out of your Sirraha account.
                  </p>
                </div>

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;