import Hero from "../../components/home/Hero";
import BenefitsStrip from "../../components/home/BenefitsStrip";
import NewArrivals from "../../components/home/NewArrivals";
import CraftedSection from "../../components/home/CraftedSection";
import BestSellers from "../../components/home/BestSellers";
import OurPromise from "../../components/home/OurPromise";
import ReviewsSection from "../../components/home/ReviewsSection";
import Footer from "../../components/layout/Footer";
import CustomerGallery from "../../components/home/CustomerGallery";

function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden bg-white">
      <Hero />

      <BenefitsStrip />

      <NewArrivals />

      <CraftedSection />

      <BestSellers />

      <OurPromise />

       {/* Customer reviews immediately above the footer */}
    <ReviewsSection />
    {/* CUSTOMER INSTAGRAM GALLERY */}
    <CustomerGallery />

      <Footer />
    </main>
  );
}

export default Home;