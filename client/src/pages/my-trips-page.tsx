import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { TravelPreference, TravelPackage, Destination } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2, Calendar, Users, Package, IndianRupee } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MyTripsPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: preferences, isLoading } = useQuery<TravelPreference[]>({
    queryKey: ["/api/travel-preferences"],
  });

  // Filter preferences based on status
  const filteredPreferences = preferences?.filter(preference => {
    if (activeTab === "all") return true;
    return preference.status === activeTab;
  }).sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-gray-600">Track and manage your travel plans</p>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          onClick={() => navigate("/")} 
        >
          Plan a New Trip
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Trips</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredPreferences?.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No trips found</h3>
            <p className="text-gray-500 mt-2">
              You haven't planned any trips yet. Start by creating a new trip.
            </p>
            <Button className="mt-6" onClick={() => navigate("/")}>
              Plan Your First Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPreferences?.map((preference) => (
            <PreferenceCard key={preference.id} preference={preference} />
          ))}
        </div>
      )}
    </div>
  );
}

function PreferenceCard({ preference }: { preference: TravelPreference }) {
  const [, navigate] = useLocation();
  
  const { data: packages, isLoading: isLoadingPackages } = useQuery<TravelPackage[]>({
    queryKey: [`/api/travel-preferences/${preference.id}/packages`],
  });
  
  const { data: destination } = useQuery<Destination>({
    queryKey: [`/api/destinations/${preference.destinationId}`],
    enabled: !!preference.destinationId,
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800"
  };
  
  const formatDateString = (date: Date | string | null | undefined) => {
    if (!date) return "Not specified";
    return format(new Date(date), "MMMM d, yyyy");
  };

  const destinationName = destination?.name || "Custom Trip";
  const destinationCountry = destination?.country || "Multiple Destinations";
  const status = preference.status || "pending";
  const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{destinationName}</CardTitle>
            <CardDescription>{destinationCountry}</CardDescription>
          </div>
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {capitalizedStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <span className="font-medium">Travel Dates: </span>
              {preference.startDate && preference.endDate ? (
                `${formatDateString(preference.startDate)} - ${formatDateString(preference.endDate)}`
              ) : (
                "Not specified"
              )}
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <span className="font-medium">Travelers: </span>
              {preference.travelers}
            </div>
          </div>
          <div className="flex items-center text-sm">
            <IndianRupee className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <span className="font-medium">Budget: </span>
              {preference.budget ? `₹${preference.budget}` : "Not specified"}
            </div>
          </div>
        </div>
        
        {isLoadingPackages ? (
          <div className="mt-4 text-center py-2">
            <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-400" />
          </div>
        ) : packages && packages.length > 0 ? (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Package Offers:</p>
            <p className="text-sm text-gray-600">{packages.length} offers available</p>
          </div>
        ) : (
          <div className="mt-4 bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">No package offers yet</p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Created {preference.createdAt ? formatDistanceToNow(new Date(preference.createdAt), { addSuffix: true }) : "recently"}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex space-x-2 w-full">
          {packages && packages.length > 0 && (
            <Button 
              className="flex-1"
              onClick={() => navigate(`/compare/${preference.id}`)}
            >
              Compare Packages
            </Button>
          )}
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
