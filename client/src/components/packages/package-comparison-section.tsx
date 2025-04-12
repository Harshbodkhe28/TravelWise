import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TravelPackage, TravelPreference, Destination } from "@shared/schema";
import { Thermometer, Umbrella, CloudRain, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import PackageCard from "./package-card";
import { Skeleton } from "@/components/ui/skeleton";

interface PackageComparisonSectionProps {
  preferenceId: number;
}

export default function PackageComparisonSection({ preferenceId }: PackageComparisonSectionProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  
  // Fetch the travel preference details
  const { data: preference, isLoading: isLoadingPreference } = useQuery<TravelPreference>({
    queryKey: [`/api/travel-preferences/${preferenceId}`],
  });
  
  // Fetch the packages for this preference
  const { data: packages, isLoading: isLoadingPackages } = useQuery<TravelPackage[]>({
    queryKey: [`/api/travel-preferences/${preferenceId}/packages`],
    enabled: !!preferenceId,
  });
  
  // Fetch the destination details if a destination is specified
  const { data: destination } = useQuery<Destination>({
    queryKey: [`/api/destinations/${preference?.destinationId}`],
    enabled: !!preference?.destinationId,
  });
  
  const handleSelectPackage = (packageId: number) => {
    setSelectedPackageId(packageId);
  };
  
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (isLoadingPreference || isLoadingPackages) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-72 mb-4" />
        <Skeleton className="h-6 w-96 mb-8" />
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-8 w-36 mt-4 md:mt-0" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-16 w-full" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-4 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="flex items-start">
                      <Skeleton className="h-6 w-6 mr-3" />
                      <div className="w-full">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!preference || !packages) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Travel preference not found</h2>
          <p className="text-gray-600">The requested travel preference could not be found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">Compare Travel Packages</h1>
      <p className="text-gray-600 mb-8">See what travel agencies are offering for your destination.</p>
      
      {/* Destination Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">
              {destination ? `${destination.name}, ${destination.country}` : "Custom Trip"}
            </h3>
            <p className="text-gray-600">
              {preference.startDate && preference.endDate ? 
                `${formatDate(preference.startDate)} - ${formatDate(preference.endDate)} · ${preference.travelers} travelers` : 
                `${preference.travelers} travelers`}
            </p>
          </div>
          {destination && destination.bestTimeToVisit && (
            <div className="mt-4 md:mt-0">
              <div className="bg-blue-50 text-secondary px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Best time to visit: {destination.bestTimeToVisit}
              </div>
            </div>
          )}
        </div>
        
        {destination && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {destination.avgTemperature && (
              <div className="flex items-center text-sm text-gray-700">
                <Thermometer className="text-gray-500 mr-2 h-4 w-4" />
                <span>Avg. temperature: {destination.avgTemperature}</span>
              </div>
            )}
            {destination.beachSeason && (
              <div className="flex items-center text-sm text-gray-700">
                <Umbrella className="text-gray-500 mr-2 h-4 w-4" />
                <span>Beach season: {destination.beachSeason}</span>
              </div>
            )}
            {destination.rainySeason && (
              <div className="flex items-center text-sm text-gray-700">
                <CloudRain className="text-gray-500 mr-2 h-4 w-4" />
                <span>Rainy season: {destination.rainySeason}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Package Comparison Cards */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">No packages available yet</h2>
          <p className="text-gray-600 mb-4">Travel agencies haven't submitted any packages for this trip yet.</p>
          <p className="text-gray-600">Check back later or explore other destinations.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <PackageCard 
                key={pkg.id} 
                travelPackage={pkg} 
                isRecommended={index === 0}
                onSelectPackage={handleSelectPackage}
                selected={selectedPackageId === pkg.id}
              />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              className="border border-gray-300 hover:border-secondary text-gray-700 hover:text-secondary font-medium px-6 py-3 rounded-md transition duration-200"
            >
              <Table className="mr-2 h-4 w-4" />
              Compare in detail
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
