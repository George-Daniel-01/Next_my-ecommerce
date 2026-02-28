"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/app/components/PaymentForm";
import { placeOrder } from "@/app/store/slices/orderSlice";
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

export default function PaymentPage() {
  const { authUser } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { orderStep, paymentIntent } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const router = useRouter();
  const [stripePromise, setStripePromise] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({ fullName: "", state: "Lagos", phone: "", address: "", city: "", zipCode: "", country: "Nigeria" });

  useEffect(() => {
    if (!authUser) { router.push("/products"); return; }
    loadStripe("pk_test_51SsX0oGYwxTwogKWYYeq93CjPGg5PAWUUpqMehC1hj4GKc0ULyAKtavkVOzmuu3OPmMFhxGKU5R4EehTCGeJoJaA00pRyCocmp").then(setStripePromise);
  }, [authUser, router]);

  if (!cart || cart.length === 0) return (
    <ThemeProvider>
      <div className="min-h-screen bg-background"><Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center glass-panel max-w-md"><h1 className="text-3xl font-bold text-foreground mb-4">No Items in Cart.</h1><Link href="/products" className="inline-flex items-center px-6 py-3 rounded-lg text-primary-foreground gradient-primary font-semibold">Browse Products</Link></div>
        </div>
      </div>
    </ThemeProvider>
  );

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalWithTax = total + total * 0.18 + (total < 50 ? 2 : 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", shippingDetails.fullName);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.zipCode);
    formData.append("phone", shippingDetails.phone);
    formData.append("orderedItems", JSON.stringify(cart));
    dispatch(placeOrder(formData));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar /><Sidebar /><SearchOverlay /><CartSidebar /><ProfilePanel /><LoginModal />
        <div className="min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 ${orderStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 1 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>{orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}</div>
                    <span className="font-medium">Details</span>
                  </div>
                  <div className={`w-12 h-0.5 ${orderStep >= 2 ? "bg-primary" : "bg-border"}`} />
                  <div className={`flex items-center space-x-2 ${orderStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 2 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>2</div>
                    <span className="font-medium">Payment</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {orderStep === 1 ? (
                    <form onSubmit={handlePlaceOrder} className="glass-panel space-y-4">
                      <h2 className="text-xl font-semibold text-foreground mb-6">Shipping Information</h2>
                      <div><label className="block text-sm font-medium text-foreground mb-2">Full Name *</label><input type="text" required value={shippingDetails.fullName} onChange={(e) => setShippingDetails({...shippingDetails, fullName: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-foreground mb-2">Phone *</label><input type="text" required value={shippingDetails.phone} onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                        <div><label className="block text-sm font-medium text-foreground mb-2">State *</label><input type="text" required value={shippingDetails.state} onChange={(e) => setShippingDetails({...shippingDetails, state: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                      </div>
                      <div><label className="block text-sm font-medium text-foreground mb-2">Address *</label><input type="text" required value={shippingDetails.address} onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium text-foreground mb-2">City *</label><input type="text" required value={shippingDetails.city} onChange={(e) => setShippingDetails({...shippingDetails, city: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                        <div><label className="block text-sm font-medium text-foreground mb-2">ZIP Code *</label><input type="text" required value={shippingDetails.zipCode} onChange={(e) => setShippingDetails({...shippingDetails, zipCode: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                        <div><label className="block text-sm font-medium text-foreground mb-2">Country *</label><input type="text" required value={shippingDetails.country} onChange={(e) => setShippingDetails({...shippingDetails, country: e.target.value})} className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" /></div>
                      </div>
                      <button type="submit" className="w-full py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold">Continue to Payment</button>
                    </form>
                  ) : (
                    stripePromise && <Elements stripe={stripePromise} options={{ clientSecret: paymentIntent }}><PaymentForm /></Elements>
                  )}
                </div>
                <div className="lg:col-span-1">
                  <div className="glass-panel sticky top-24">
                    <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3">
                          <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{item.product.name}</p><p className="text-xs text-muted-foreground">Qty: {item.quantity}</p></div>
                          <p className="text-sm font-semibold">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 border-t border-[hsla(var(--glass-border))] pt-4">
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${(total * 0.18).toFixed(2)}</span></div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[hsla(var(--glass-border))]"><span>Total</span><span className="text-primary">${totalWithTax.toFixed(2)}</span></div>
                    </div>
                  </div>
                </div>
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

