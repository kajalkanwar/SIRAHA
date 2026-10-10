import Hero from "../../components/home/Hero";
import BenefitsStrip from "../../components/home/BenefitsStrip";
import NewArrivals from "../../components/home/NewArrivals";
import CraftedSection from "../../components/home/CraftedSection";
import BestSellers from "../../components/home/BestSellers";
import OurPromise from "../../components/home/OurPromise";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden bg-[#FAF7F0]">
      <Hero />

      <BenefitsStrip />

      <NewArrivals />

      <CraftedSection />

      <BestSellers />

      <OurPromise />

      <Footer />
    </main>
  );
}

export default Home;