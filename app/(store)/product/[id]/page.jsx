"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, ShoppingCart, Share2, Plus, Minus, Loader, CircleDollarSign } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReviewsContainer from "@/app/components/Products/ReviewsContainer";
import { addToCart } from "@/app/store/slices/cartSlice";
import { fetchProductDetails, resetProductDetails } from "@/app/store/slices/productSlice";
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

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const product = useSelector((state) => state.product?.productDetails);
  const { loading, productReviews } = useSelector((state) => state.product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    dispatch(resetProductDetails());
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  const handleAddToCart = () => dispatch(addToCart({ product, quantity }));
  const handleBuyNow = () => { dispatch(addToCart({ product, quantity })); router.push("/payment"); };
  const handleCopyURL = () => navigator.clipboard.writeText(window.location.href).then(() => toast.success("URL Copied!"));

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar /><Sidebar /><SearchOverlay /><CartSidebar /><ProfilePanel /><LoginModal />
        <div className="min-h-screen pt-20">
          {loading ? (
            <div className="flex items-center justify-center h-screen"><Loader className="size-10 animate-spin" /></div>
          ) : !product ? (
            <div className="min-h-screen pt-20 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1></div></div>
          ) : (
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div>
                  <div className="glass-card p-4 mb-4">
                    <img src={product.images?.[selectedImage]?.url} alt={product.name} className="w-full h-96 object-contain rounded-lg" />
                  </div>
                  <div className="flex space-x-2">
                    {product.images?.map((image, index) => (
                      <button key={index} onClick={() => setSelectedImage(index)} className={"w-20 h-20 rounded-lg overflow-hidden border-2 transition-all " + (selectedImage === index ? "border-primary" : "border-transparent")}>
                        <img src={image?.url} alt={product.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className={"w-4 h-4 " + (i < Math.floor(product.ratings) ? "text-yellow-400 fill-current" : "text-gray-300")} />)}
                    </div>
                    <span className="text-muted-foreground">({productReviews?.length}) reviews</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                  </div>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-muted-foreground">Category: {product.category}</span>
                    <span className={"px-3 py-1 rounded text-sm " + (product.stock > 5 ? "bg-green-500/20 text-green-400" : product.stock > 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400")}>
                      {product.stock > 5 ? "In Stock" : product.stock > 0 ? "Limited Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="glass-card p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-lg font-medium">Quantity:</span>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 glass-card hover:glow-on-hover animate-smooth"><Minus className="w-4 h-4" /></button>
                        <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 glass-card hover:glow-on-hover animate-smooth"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={handleAddToCart} disabled={product.stock === 0} className="flex items-center justify-center space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50">
                        <ShoppingCart className="w-5 h-5" /><span>Add to Cart</span>
                      </button>
                      <button onClick={handleBuyNow} disabled={product.stock === 0} className="flex items-center justify-center space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50">
                        <CircleDollarSign className="w-5 h-5" /><span>Buy Now</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <button onClick={handleCopyURL} className="flex items-center space-x-2 text-muted-foreground hover:text-primary animate-smooth">
                        <Share2 className="w-5 h-5" /><span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-panel">
                <div className="flex border-b border-border">
                  {["description", "reviews"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={"px-6 py-4 font-medium capitalize transition-all " + (activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground")}>{tab}</button>
                  ))}
                </div>
                <div className="p-6">
                  {activeTab === "description" && <p className="text-muted-foreground leading-relaxed">{product.description}</p>}
                  {activeTab === "reviews" && <ReviewsContainer product={product} productReviews={productReviews} />}
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}