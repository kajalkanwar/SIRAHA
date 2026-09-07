import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiMail } from "react-icons/fi";

function AccountDetails() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [formData, setFormData] = useState({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the saved user details
    const updatedUser = {
      ...savedUser,
      name: formData.name,
      email: formData.email,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setSuccess("Your account details have been updated.");
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2937]">

      {/* HEADER */}

      <section className="border-b border-[#E5E0D6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">

          <button
            type="button"
            onClick={() => navigate("/account")}
            className="
              flex
              items-center
              gap-2
              text-[#0E5B3B]
              text-sm
              mb-8
              hover:underline
            "
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to My Profile
          </button>

          <p className="
            text-[#0E5B3B]
            text-[11px]
            tracking-[0.35em]
            uppercase
            mb-3
          ">
            SIRRAHA ACCOUNT
          </p>

          <h1 className="
            font-serif
            text-4xl
            sm:text-5xl
            text-[#0E5B3B]
          ">
            Account Details
          </h1>

          <p className="
            mt-3
            text-[#64748B]
            text-sm
            sm:text-base
          ">
            Update your personal information.
          </p>

        </div>
      </section>

      {/* FORM */}

      <main className="
        max-w-6xl
        mx-auto
        px-6
        sm:px-8
        lg:px-12
        py-10
        sm:py-14
      ">

        <div className="
          max-w-2xl
          bg-white/40
          border
          border-[#E5E0D6]
          p-7
          sm:p-10
        ">

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="mb-6">

              <label className="
                block
                text-[#111827]
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.18em]
                mb-3
              ">
                Full Name
              </label>

              <div className="relative">

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    rounded-md
                    border
                    border-[#CFC8BC]
                    bg-transparent
                    px-4
                    pr-12
                    outline-none
                    focus:border-[#0E5B3B]
                  "
                />

                <FiUser className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#64748B]
                " />

              </div>

            </div>

            {/* EMAIL */}

            <div className="mb-8">

              <label className="
                block
                text-[#111827]
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.18em]
                mb-3
              ">
                Email Address
              </label>

              <div className="relative">

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="
                    w-full
                    h-14
                    rounded-md
                    border
                    border-[#CFC8BC]
                    bg-transparent
                    px-4
                    pr-12
                    outline-none
                    focus:border-[#0E5B3B]
                  "
                />

                <FiMail className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#64748B]
                " />

              </div>

            </div>

            {/* SUCCESS MESSAGE */}

            {success && (
              <p className="
                mb-6
                text-sm
                text-[#0E5B3B]
              ">
                {success}
              </p>
            )}

            {/* SAVE BUTTON */}

            <button
              type="submit"
              className="
                w-full
                h-14
                rounded-md
                bg-[#0E5B3B]
                text-white
                text-sm
                font-semibold
                tracking-[0.18em]
                hover:bg-[#09472E]
                transition-colors
              "
            >
              SAVE CHANGES
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AccountDetails;