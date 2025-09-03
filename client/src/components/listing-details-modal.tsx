import { type Listing } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyMap } from "@/components/ui/map";
import { MapPin, Users, Settings, Calendar, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ListingDetailsModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onContact: (listing: Listing) => void;
}

export function ListingDetailsModal({ listing, isOpen, onClose, onContact }: ListingDetailsModalProps) {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mapType, setMapType] = useState<"standard" | "terrain" | "satellite" | "light">("standard");

  useEffect(() => {
    if (listing) {
      console.log('Listing details map coordinates:', {
        latitude: listing.latitude,
        longitude: listing.longitude,
        parsedLatitude: parseFloat(listing.latitude || "0"),
        parsedLongitude: parseFloat(listing.longitude || "0")
      });
    }
  }, [listing]);

  if (!listing) return null;

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
                src={images[selectedImageIndex] || "/placeholder-image.jpg"}
                alt={listing.title}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
                data-testid="listing-main-image"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full w-10 h-10 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => 
                        prev === 0 ? images.length - 1 : prev - 1
                      );
                    }}
                    data-testid="prev-image-button"
                  >
                    ←
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 rounded-full w-10 h-10 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) => 
                        prev === images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    data-testid="next-image-button"
                  >
                    →
                  </Button>
                </>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2" data-testid="listing-image-thumbnails">
                {images.map((image, index) => (
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

            {/* Contact Information */}
            {listing.contactNumber && (
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <p className="text-slate-700" data-testid="listing-details-contactNumber">
                  {listing.contactNumber}
                </p>
              </div>
            )}

            {/* Contact Button */}
            <Button
              onClick={() => onContact(listing)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 text-lg mt-4"
              data-testid="contact-button"
            >
              <Mail className="w-5 h-5 mr-2" />
              {t("contactSeller")}
            </Button>
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
            
            {/* Vehicle Features */}
            <div className="grid gap-4 py-4 border-t border-b border-slate-200 grid-cols-3">
              <div className="text-center">
                <Users className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-owners">
                  {listing.owners === 0 ? "New" : listing.owners || "N/A"}
                </div>
                <div className="text-sm text-slate-500">Owners</div>
              </div>
              <div className="text-center">
                <Settings className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-wheels">
                  {listing.wheels || "N/A"}
                </div>
                <div className="text-sm text-slate-500">Wheels</div>
              </div>
              <div className="text-center">
                <Calendar className="w-6 h-6 text-slate-400 mb-2 mx-auto" />
                <div className="text-lg font-semibold text-slate-900" data-testid="listing-details-yearOfManufacture">
                  {listing.yearOfManufacture || "N/A"}
                </div>
                <div className="text-sm text-slate-500">Year</div>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{t("description")}</h3>
              <div className="max-h-40 overflow-y-auto">
                <p className="text-slate-600 leading-relaxed" data-testid="listing-details-description">
                  {listing.description}
                </p>
              </div>
            </div>
            
            {/* Map */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold text-slate-900">{t("location")}</h3>
                <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
                  <button
                    onClick={() => setMapType("standard")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      mapType === "standard" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title={t("standardMap")}
                  >
                    {t("standard")}
                  </button>
                  <button
                    onClick={() => setMapType("terrain")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      mapType === "terrain" 
                        ? "bg-green-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title={t("terrainMap")}
                  >
                    {t("terrain")}
                  </button>
                  <button
                    onClick={() => setMapType("satellite")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      mapType === "satellite" 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title={t("satelliteView")}
                  >
                    {t("satellite")}
                  </button>
                  <button
                    onClick={() => setMapType("light")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      mapType === "light" 
                        ? "bg-gray-600 text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    title={t("lightMap")}
                  >
                    {t("light")}
                  </button>
                </div>
              </div>
            <div className="h-64">
                <PropertyMap
                  latitude={parseFloat(listing.latitude || "0")}
                  longitude={parseFloat(listing.longitude || "0")}
                  interactive={false}
                  mapType={mapType}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
