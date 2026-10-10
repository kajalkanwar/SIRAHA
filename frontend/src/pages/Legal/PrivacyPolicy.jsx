import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-[#71655B]">
              
              This Privacy Policy describes how Sirraha (the “Site” or “we”) collects, uses, 
              and discloses your Personal Information when you visit or make a purchase from the Site.
              
              Collecting Personal Information

              When you visit the Site, we collect certain information about your device,
              your interaction with the Site, and the information necessary to process your purchases.
              We may also collect additional information if you contact us for customer support. 
              In this Privacy Policy, we refer to any information that can uniquely identify an 
              individual (including the information below) as “Personal Information”.
              See the list below for more information about what Personal Information we collect and why.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-8">
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              1. Information We Collect
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Depending on how you use Sirraha, we may
              collect information such as:
            name, billing address, shipping address, 
            and payment information, email address, and phone number.
            Purpose of collection: to provide products or services to you to fulfill our contract,
            to process your payment information, arrange for shipping, and provide you with invoices and/or 
            order confirmations, communicate with you, screen our orders for potential risk or fraud, 
            and when in line with the preferences you have shared with us, 
            provide you with information or advertising relating to our products or services. 
            We collect only the information necessary to provide our services, process orders, communicate with you, and maintain your account.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              2. OTP Authentication
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
             Sirraha uses one-time passwords (OTPs) to securely verify your identity 
             when you sign in or access your account.
              Depending on the option you choose, an OTP may be sent to your 
              registered mobile number or email address. 
              OTPs are valid for a limited period and are intended for one-time use only.
              



            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              3. How We Use Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Information may be used to process orders,
              provide customer support, manage your account,
              communicate important order updates and
              improve the Sirraha shopping experience.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              4. Order and Delivery Information
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Delivery information may be shared with
              relevant shipping or service providers when
              necessary to fulfil your order.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              5. Data Security
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Sirraha takes reasonable measures to protect
              customer information. However, no online
              transmission or storage system can be
              guaranteed to be completely secure.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              6. Third-party OTP services
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              Sirraha may work with trusted third-party service providers to deliver authentication messages, emails, payments, shipping services, and other essential services. These providers may process limited information as required to perform their services and are expected to maintain appropriate security measures.
            </p>
          </div>

          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl text-[#43231C]">
              7. Policy Updates
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#71655B]">
              This Privacy Policy may be updated from time
              to time to reflect changes to the Sirraha
              website, services or applicable requirements.
            </p>
          </div>

          <div className="border-t border-[#DED4C4] pt-6">
            <p className="text-xs leading-6 text-[#918477]">
              This is general privacy-policy wording for
              the Sirraha website. Before the commercial
              website goes live, the final policy should be
              reviewed and adapted to Sirraha's actual data
              practices and applicable law.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicy;