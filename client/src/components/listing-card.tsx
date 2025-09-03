import { type Listing } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Settings, Calendar } from "lucide-react";
import { useState } from "react";

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = listing.images || [];
  const formatPrice = (price: number, type: string) => {
    const formatted = price.toLocaleString();
    return type === "For Rent" ? `$${formatted}/mo` : `$${formatted}`;
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "For Sale":
        return "bg-primary-100 text-primary-800";
      case "For Rent":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer listing-card-hover bg-white"
      onClick={onClick}
      data-testid={`listing-card-${listing.id}`}
    >
      <div className="relative">
        <img
          src={images[currentImageIndex] || "/placeholder-image.jpg"}
          alt={listing.title}
          className="w-full h-48 object-cover"
          data-testid={`listing-image-${listing.id}`}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full w-8 h-8 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => 
                  prev === 0 ? images.length - 1 : prev - 1
                );
              }}
              data-testid={`prev-image-button-${listing.id}`}
            >
              ←
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full w-8 h-8 shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => 
                  prev === images.length - 1 ? 0 : prev + 1
                );
              }}
              data-testid={`next-image-button-${listing.id}`}
            >
              →
            </Button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getBadgeColor(listing.type)} data-testid={`listing-type-${listing.id}`}>
            {listing.type}
          </Badge>
          <span className="text-2xl font-bold text-slate-900" data-testid={`listing-price-${listing.id}`}>
            {formatPrice(listing.price, listing.type)}
          </span>
        </div>
        
        <h4 className="text-lg font-semibold text-slate-900 mb-2" data-testid={`listing-title-${listing.id}`}>
          {listing.title}
        </h4>
        
        <p className="text-slate-600 text-sm mb-3 line-clamp-2" data-testid={`listing-description-${listing.id}`}>
          {listing.description}
        </p>
        
        <div className="flex items-center text-slate-500 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-2" />
          <span data-testid={`listing-location-${listing.id}`}>{listing.location}</span>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm space-x-4">
          {listing.owners !== null && listing.owners !== undefined && (
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span data-testid={`listing-owners-${listing.id}`}>
                {listing.owners === 0 ? "New" : `${listing.owners} owners`}
              </span>
            </span>
          )}
          {listing.wheels !== null && listing.wheels !== undefined && (
            <span className="flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              <span data-testid={`listing-wheels-${listing.id}`}>{listing.wheels} wheels</span>
            </span>
          )}
          {listing.yearOfManufacture && (
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span data-testid={`listing-yearOfManufacture-${listing.id}`}>{listing.yearOfManufacture}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
