"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { getUser } from "./store/slices/authSlice";
import { fetchAllProducts } from "./store/slices/productSlice";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";
import HeroSlider from "./components/Home/HeroSlider";
import CategoryGrid from "./components/Home/CategoryGrid";
import ProductSlider from "./components/Home/ProductSlider";
import FeatureSection from "./components/Home/FeatureSection";
import NewsletterSection from "./components/Home/NewsletterSection";

function HomeContent() {
  const { isCheckingAuth } = useSelector((state) => state.auth);
  const { topRatedProducts, newProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Sidebar />
        <SearchOverlay />
        <CartSidebar />
        <ProfilePanel />
        <LoginModal />
        <div className="min-h-screen pt-20">
          <HeroSlider />
          <div className="container mx-auto px-4 pt-4">
            <CategoryGrid />
            {newProducts?.length > 0 && <ProductSlider title="New Arrivals" products={newProducts} />}
            {topRatedProducts?.length > 0 && <ProductSlider title="Top Rated Products" products={topRatedProducts} />}
            <FeatureSection />
            <NewsletterSection />
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default function Home() {
  return <HomeContent />;
}
