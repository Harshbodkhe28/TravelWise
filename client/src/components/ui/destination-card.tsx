import { Destination } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CalendarClock, Thermometer, Umbrella, CloudRain, ChevronRight } from "lucide-react";

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  const { id, name, country, imageUrl, bestTimeToVisit, avgTemperature, beachSeason, rainySeason } = destination;
  
  return (
    <Card className="group overflow-hidden">
      <div className="relative overflow-hidden h-48">
        <img 
          src={imageUrl} 
          alt={`${name}, ${country}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className="text-white/90 text-sm">{country}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {bestTimeToVisit && (
            <div className="flex items-center text-sm">
              <CalendarClock className="text-primary mr-2 h-4 w-4 shrink-0" />
              <span className="text-gray-700">Best time: {bestTimeToVisit}</span>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {avgTemperature && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Thermometer className="h-3 w-3" /> {avgTemperature}
              </Badge>
            )}
            
            {beachSeason && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Umbrella className="h-3 w-3" /> {beachSeason}
              </Badge>
            )}
            
            {rainySeason && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <CloudRain className="h-3 w-3" /> {rainySeason}
              </Badge>
            )}
          </div>
          
          <div className="pt-2">
            <Link href={`/#preference-form`}>
              <a className="text-sm text-secondary hover:text-primary flex items-center">
                Plan a trip
                <ChevronRight className="ml-1 h-3 w-3" />
              </a>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
