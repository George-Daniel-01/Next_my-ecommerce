"use client";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { removeFromCart, updateCartQuantity } from "@/app/store/slices/cartSlice";
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

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);
  const total = cart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const cartItemsCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) dispatch(removeFromCart(id));
    else dispatch(updateCartQuantity({ id, quantity }));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar /><Sidebar /><SearchOverlay /><CartSidebar /><ProfilePanel /><LoginModal />
        <div className="min-h-screen pt-20">
          <div className="container mx-auto px-4 py-8">
            {!cart || cart.length === 0 ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center glass-panel max-w-md">
                  <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty.</h1>
                  <Link href="/products" className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold">
                    <span>Continue Shopping</span><ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8"><h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1><p className="text-muted-foreground">{cartItemsCount} items in your cart</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="glass-card p-6">
                        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                          <img src={item.product.images?.[0]?.url} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground mb-1">{item.product.name}</h3>
                            <span className="text-xl font-bold text-primary">${item.product.price}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 glass-card hover:glow-on-hover animate-smooth"><Minus className="w-4 h-4" /></button>
                              <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 glass-card hover:glow-on-hover animate-smooth"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => dispatch(removeFromCart(item.product.id))} className="p-2 glass-card hover:glow-on-hover animate-smooth text-destructive"><Trash2 className="w-4 h-4" /></button>
                          </div>
                          <p className="text-lg font-bold text-foreground">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lg:col-span-1">
                    <div className="glass-panel sticky top-24">
                      <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-500">{total >= 50 ? "Free" : "$2"}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${(total * 0.18).toFixed(2)}</span></div>
                        <div className="border-t border-[hsla(var(--glass-border))] pt-4 flex justify-between"><span className="text-lg font-semibold">Total</span><span>${(total + total * 0.18).toFixed(2)}</span></div>
                      </div>
                      {authUser && <Link href="/payment" className="w-full block text-center py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold mb-4">Proceed to Checkout</Link>}
                      <Link href="/products" className="w-full block text-center py-4 bg-secondary text-foreground rounded-lg animate-smooth font-semibold border-border hover:bg-accent">Continue Shopping</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </ThemeProvider>
  );
}

