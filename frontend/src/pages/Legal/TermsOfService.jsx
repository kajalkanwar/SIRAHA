import { useNavigate } from "react-router-dom";

function TermsOfService() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#3A2A20]">
      <section className="border-b border-[#DED4C4]">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mb-8
              font-['Poppins']
              text-[9px]
              font-medium
              uppercase
              tracking-[2px]
              text-[#A98243]
              hover:text-[#5A3026]
            "
          >
            ← Back
          </button>

          <p
            className="
              font-['Poppins']
              text-[8px]
              font-medium
              uppercase
              tracking-[3px]
              text-[#A98243]
            "
          >
            SIRRAHA
          </p>

          <h1
            className="
              mt-2
              font-['Cormorant_Garamond']
              text-[42px]
              font-normal
              text-[#43231C]
              sm:text-[50px]
            "
          >
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-[#71655B]">
            Please read these terms before using the
            Sirraha website.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-8">
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              1. About Sirraha
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Sirraha is an online clothing store offering
              thoughtfully selected ethnic and contemporary
              Indian wear. By using our website, you agree
              to use the website only for lawful purposes.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              2. Accounts and OTP Login
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Sirraha uses one-time verification codes for
              customer authentication. You are responsible
              for providing accurate contact information and
              keeping access to your email address or mobile
              number secure.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              3. Products and Pricing
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Product descriptions, photographs, availability,
              prices and offers may change from time to time.
              Sirraha makes reasonable efforts to display
              product information accurately.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              4. Orders and Payments
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              An order is considered successfully placed
              after the required checkout and payment process
              has been completed. We reserve the right to
              cancel an order in circumstances such as
              incorrect pricing, stock unavailability or
              suspected fraudulent activity.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              5. Shipping, Returns and Exchanges
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Shipping timelines, return eligibility and
              exchange conditions are governed by the
              respective policies displayed on the Sirraha
              website.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              6. Website Use
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              You must not misuse the website, attempt
              unauthorized access, interfere with website
              functionality or use the website for unlawful
              activities.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              7. Changes to These Terms
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Sirraha may update these terms when necessary.
              Updated terms will be made available on this
              page.
            </p>
          </div>

          <div className="border-t border-[#DED4C4] pt-6">
            <p className="text-xs leading-6 text-[#918477]">
              These terms are intended as general website
              terms for Sirraha and should be reviewed and
              finalized according to the business's actual
              policies and applicable law before the website
              goes live.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TermsOfService;