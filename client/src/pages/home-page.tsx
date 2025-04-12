import HeroSection from "@/components/home/hero-section";
import PreferenceForm from "@/components/home/preference-form";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedDestinations from "@/components/home/featured-destinations";
import Features from "@/components/home/features";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PreferenceForm />
      <HowItWorks />
      <FeaturedDestinations />
      <Features />
      <Testimonials />
      <CTASection />
    </div>
  );
}
