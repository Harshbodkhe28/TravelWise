import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Destination } from "@shared/schema";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DestinationCard from "@/components/ui/destination-card";

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Filter destinations based on search term and filter
  const filteredDestinations = destinations?.filter(destination => {
    const matchesSearch = 
      destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    
    // Additional filters can be implemented here
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
      <p className="text-gray-600 mb-8">Discover amazing places and find your next adventure</p>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="beach">Beach Destinations</SelectItem>
              <SelectItem value="city">City Destinations</SelectItem>
              <SelectItem value="mountain">Mountain Destinations</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>
      
      {/* Destinations Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredDestinations?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No destinations found. Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations?.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
