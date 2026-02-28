"use client";
import { Users, Target, Award, Heart } from "lucide-react";
import Navbar from "@/app/components/Layout/Navbar";
import Footer from "@/app/components/Layout/Footer";
import { ThemeProvider } from "@/app/contexts/ThemeContext";

export default function AboutPage() {
  const values = [
    { icon: Heart, title: "Customer First", description: "We put our customers at the heart of everything we do." },
    { icon: Award, title: "Quality Products", description: "We ensure all products meet our high standards." },
    { icon: Users, title: "Community", description: "Building lasting relationships with our customers." },
    { icon: Target, title: "Innovation", description: "Constantly improving our platform and services." },
  ];
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-32">
          <div className="text-center mb-16"><h1 className="text-4xl font-bold text-foreground mb-6">About ShopMate</h1></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => (
              <div key={index} className="bg-secondary rounded-xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center"><value.icon className="w-8 h-8 text-primary" /></div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

