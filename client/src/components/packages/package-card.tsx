import { TravelPackage } from "@shared/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PACKAGE_TYPES } from "@/lib/constants";
import { Heart, Hotel, Plane, Utensils, Map } from "lucide-react";

interface PackageCardProps {
  travelPackage: TravelPackage;
  isRecommended?: boolean;
  onSelectPackage?: (packageId: number) => void;
  selected?: boolean;
}

export default function PackageCard({ 
  travelPackage, 
  isRecommended = false,
  onSelectPackage,
  selected = false
}: PackageCardProps) {
  const { 
    id, 
    title, 
    price, 
    pricePerPerson, 
    packageType, 
    accommodation, 
    transportation, 
    meals, 
    activities, 
    agencyId 
  } = travelPackage;

  // Get package style based on type
  const packageStyle = PACKAGE_TYPES[packageType as keyof typeof PACKAGE_TYPES] || PACKAGE_TYPES.standard;
  
  return (
    <Card className={`overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className={`${packageStyle.bgColor} ${packageStyle.textColor} px-6 py-4`}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          {isRecommended && (
            <Badge className="text-xs px-2 py-1 bg-white text-secondary rounded-full">Recommended</Badge>
          )}
          {packageType === "premium" && (
            <Badge className="text-xs px-2 py-1 bg-accent text-white rounded-full">Premium</Badge>
          )}
          {packageType === "budget" && (
            <Badge className="text-xs px-2 py-1 bg-gray-600 text-white rounded-full">Value</Badge>
          )}
        </div>
        <p className="text-sm opacity-90">By Agency #{agencyId}</p>
      </div>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">₹{price}</div>
          <div className="text-sm text-gray-500">{pricePerPerson ? "per person" : "total"}</div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <Hotel className="text-gray-500 mt-1 mr-3 h-5 w-5" />
            <div>
              <h4 className="font-medium">Accommodation</h4>
              <p className="text-sm text-gray-600">{accommodation || "Not specified"}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Plane className="text-gray-500 mt-1 mr-3 h-5 w-5" />
            <div>
              <h4 className="font-medium">Transportation</h4>
              <p className="text-sm text-gray-600">{transportation || "Not specified"}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Utensils className="text-gray-500 mt-1 mr-3 h-5 w-5" />
            <div>
              <h4 className="font-medium">Meals</h4>
              <p className="text-sm text-gray-600">{meals || "Not included"}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Map className="text-gray-500 mt-1 mr-3 h-5 w-5" />
            <div>
              <h4 className="font-medium">Activities</h4>
              <p className="text-sm text-gray-600">{activities || "Not specified"}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-gray-100 pt-4 px-6 pb-6 flex space-x-3">
        <Button 
          className="w-full bg-primary hover:bg-opacity-90 text-white py-2 rounded font-medium transition duration-200"
          onClick={() => onSelectPackage && onSelectPackage(id)}
        >
          {selected ? "Selected" : "Select Package"}
        </Button>
        <Button variant="outline" size="icon" className="flex-shrink-0 border border-gray-300 p-2 rounded text-gray-500 hover:text-secondary hover:border-secondary transition duration-200">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
