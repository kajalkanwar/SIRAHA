import AnnouncementBar from "../../components/home/AnnouncementBar";
import Hero from "../../components/home/Hero";
import Navbar from "../../components/layout/Navbar";
import Categories from "../../components/home/Categories";
import NewArrivals from "../../components/home/NewArrivals";
import BestSellers from "../../components/home/BestSellers";
import Footer from "../../components/layout/Footer";

function Home() {
  return (
    <main className="w-full min-w-0 overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <Hero />
       <Categories />
       <NewArrivals />
       <BestSellers />
       <Footer />
    </main>
  );
}

export default Home;