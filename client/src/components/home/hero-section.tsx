import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-20 md:pt-24">
      <div className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Scenic mountain landscape with lake" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-md md:max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your Perfect Trip, <br/>Planned by Experts
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Get personalized travel plans from verified agencies tailored to your preferences and budget.
            </p>
            <Link href="#preference-form">
              <Button className="bg-primary hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-medium transition duration-200 shadow-lg">
                Start Planning Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
