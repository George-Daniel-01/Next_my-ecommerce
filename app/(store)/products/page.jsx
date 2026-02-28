"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "@/app/data/products";
import ProductCard from "@/app/components/Products/ProductCard";
import Pagination from "@/app/components/Products/Pagination";
import AISearchModal from "@/app/components/Products/AISearchModal";
import { fetchAllProducts } from "@/app/store/slices/productSlice";
import { toggleAIModal } from "@/app/store/slices/popupSlice";
import Navbar from "@/app/components/Layout/Navbar";
import Sidebar from "@/app/components/Layout/Sidebar";
import SearchOverlay from "@/app/components/Layout/SearchOverlay";
import CartSidebar from "@/app/components/Layout/CartSidebar";
import ProfilePanel from "@/app/components/Layout/ProfilePanel";
import LoginModal from "@/app/components/Layout/LoginModal";
import Footer from "@/app/components/Layout/Footer";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const { products, totalProducts } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts({ category: selectedCategory, price: `${priceRange[0]}-${priceRange[1]}`, search: searchQuery, ratings: selectedRating, availability, page: currentPage }));
  }, [dispatch, selectedCategory, priceRange, searchQuery, selectedRating, availability, currentPage]);

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar /><Sidebar /><SearchOverlay /><CartSidebar /><ProfilePanel /><LoginModal />
        <div className="min-h-screen pt-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="lg:hidden mb-4 p-3 glass-card hover:glow-on-hover animate-smooth flex items-center space-x-2">
                <Filter className="w-5 h-5" /><span>Filters</span>
              </button>
              <div className={`lg:block ${isMobileFilterOpen ? "block" : "hidden"} w-full lg:w-80 space-y-6`}>
                <div className="glass-panel">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Filters</h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3">Price Range</h3>
                    <input type="range" min="0" max="10000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground"><span>${priceRange[0]}</span><span>${priceRange[1]}</span></div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3">Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <button key={rating} onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)} className={`flex items-center space-x-2 w-full p-2 rounded ${selectedRating === rating ? "bg-primary/20" : "hover:bg-secondary"}`}>
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />)}
                          <span className="text-sm">& Up</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3">Availability</h3>
                    <div className="space-y-2">
                      {["in-stock", "limited", "out-of-stock"].map((status) => (
                        <button key={status} onClick={() => setAvailability(availability === status ? "" : status)} className={`w-full p-2 text-left rounded ${availability === status ? "bg-primary/20" : "hover:bg-secondary"}`}>
                          {status === "in-stock" ? "In Stock" : status === "limited" ? "Limited Stock" : "Out of Stock"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-foreground mb-3">Category</h3>
                    <div className="space-y-2">
                      <button onClick={() => setSelectedCategory("")} className={`w-full p-2 text-left rounded ${!selectedCategory ? "bg-primary/20" : "hover:bg-secondary"}`}>All Categories</button>
                      {categories.map((category) => (
                        <button key={category.id} onClick={() => setSelectedCategory(category.name)} className={`w-full p-2 text-left rounded ${selectedCategory === category.name ? "bg-primary/20" : "hover:bg-secondary"}`}>{category.name}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-8 flex items-center gap-2">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" placeholder="Search Products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground" />
                  </div>
                  <button onClick={() => dispatch(toggleAIModal())} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 hover:text-white dark:text-white min-w-[132px]">
                    <span className="relative w-full px-5 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent flex justify-center items-center gap-2">
                      <Sparkles className="w-5 h-5" /><span>AI Search</span>
                    </span>
                  </button>
                </div>
                <AISearchModal />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {products.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
                {products.length === 0 && <div className="text-center py-12"><p className="text-muted-foreground text-lg">No products found.</p></div>}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}

