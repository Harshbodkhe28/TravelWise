import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function FeaturedDestinations() {
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Render skeleton cards during loading
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
        <Skeleton className="w-full h-64" />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    ));
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-3">Popular Destinations</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover our most requested destinations and start planning your dream trip.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : (
            destinations?.slice(0, 4).map((destination) => (
              <div 
                key={destination.id} 
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={destination.imageUrl} 
                  alt={`${destination.name}, ${destination.country}`} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-semibold text-lg">{destination.name}, {destination.country}</h3>
                  <div className="flex items-center text-white/90 text-sm mt-1">
                    <span className="bg-primary/90 px-2 py-0.5 rounded text-xs">
                      Best time: {destination.bestTimeToVisit}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-10 text-center">
          <Link href="/explore" className="inline-flex items-center text-secondary font-medium hover:underline">
            Explore all destinations
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
