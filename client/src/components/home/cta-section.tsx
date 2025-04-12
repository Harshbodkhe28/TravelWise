import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  const { user } = useAuth();
  
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">Ready to Plan Your Dream Trip?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">
          Let travel experts compete to create your perfect travel experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Link href="#preference-form">
              <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition duration-200">
                Start Planning Now
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium transition duration-200">
                Sign Up to Start
              </Button>
            </Link>
          )}
          
          {user?.role !== "agency" && (
            <Link href={user ? "/agency-dashboard" : "/auth?tab=register"}>
              <Button className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition duration-200">
                For Travel Agencies
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
