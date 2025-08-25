import { type Listing } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
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
          src={listing.images[0] || "/placeholder-image.jpg"}
          alt={listing.title}
          className="w-full h-48 object-cover"
          data-testid={`listing-image-${listing.id}`}
        />
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
          {listing.bedrooms !== null && listing.bedrooms !== undefined && (
            <span className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span data-testid={`listing-bedrooms-${listing.id}`}>
                {listing.bedrooms === 0 ? "Studio" : `${listing.bedrooms} bed`}
              </span>
            </span>
          )}
          {listing.bathrooms !== null && listing.bathrooms !== undefined && (
            <span className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span data-testid={`listing-bathrooms-${listing.id}`}>{listing.bathrooms} bath</span>
            </span>
          )}
          {listing.sqft && (
            <span className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span data-testid={`listing-sqft-${listing.id}`}>{listing.sqft.toLocaleString()} sqft</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
