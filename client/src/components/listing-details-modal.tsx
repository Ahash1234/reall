import { type Listing } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Mail } from "lucide-react";
import { useState } from "react";

interface ListingDetailsModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (listing: Listing) => void;
}

export function ListingDetailsModal({ listing, isOpen, onClose, onContact }: ListingDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!listing) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" data-testid="listing-details-modal">
        <DialogHeader>
          <DialogTitle data-testid="listing-details-title">{listing.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <div className="relative mb-4">
              <img
                src={listing.images[selectedImageIndex] || "/placeholder-image.jpg"}
                alt={listing.title}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
                data-testid="listing-main-image"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2" data-testid="listing-image-thumbnails">
                {listing.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    className={`h-20 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                    data-testid={`listing-thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <Badge className={`${getBadgeColor(listing.type)} mb-3`} data-testid="listing-details-type">
                {listing.type}
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 mb-2" data-testid="listing-details-name">
                {listing.title}
              </h2>
              <div className="flex items-center text-slate-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span data-testid="listing-details-location">{listing.location}</span>
              </div>
              <div className="text-3xl font-bold text-primary-600 mb-6" data-testid="listing-details-price">
                {formatPrice(listing.price, listing.type)}
              </div>
            </div>
            
            {/* Property Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-200">
              <div className="text-center">
                <Bed className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-bedrooms">
                  {listing.bedrooms === 0 ? "Studio" : listing.bedrooms || "N/A"}
                </div>
                <div className="text-sm text-slate-500">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-bathrooms">
                  {listing.bathrooms || "N/A"}
                </div>
                <div className="text-sm text-slate-500">Bathrooms</div>
              </div>
              <div className="text-center">
                <Square className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-sqft">
                  {listing.sqft ? listing.sqft.toLocaleString() : "N/A"}
                </div>
                <div className="text-sm text-slate-500">Sq Ft</div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Description</h3>
              <p className="text-slate-600 leading-relaxed" data-testid="listing-details-description">
                {listing.description}
              </p>
            </div>
            
            {/* Map Placeholder */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Location</h3>
              <div className="h-48 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <div className="text-center text-slate-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Interactive map would be displayed here</p>
                  <p className="text-sm">(Google Maps integration)</p>
                </div>
              </div>
            </div>
            
            {/* Contact Button */}
            <Button
              onClick={() => onContact(listing)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 text-lg"
              data-testid="contact-button"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact About This Property
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
