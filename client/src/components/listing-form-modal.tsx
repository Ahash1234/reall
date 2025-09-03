import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyMap } from "@/components/ui/map";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema } from "@shared/schema";
import { type InsertListing, type Listing } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, MapPin, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { geocodeAddress } from "@/lib/geocoding";

interface ListingFormModalProps {
  listing?: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function ListingFormModal({ listing, isOpen, onClose }: ListingFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<string[]>(listing?.images || []);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const form = useForm<InsertListing>({
    resolver: zodResolver(insertListingSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price || 0,
      location: listing?.location || "",
      latitude: listing?.latitude || "0",
      longitude: listing?.longitude || "0",
      type: (listing?.type as "For Sale" | "For Rent") || "For Sale",
      owners: listing?.owners || 0,
      wheels: listing?.wheels || 0,
      yearOfManufacture: listing?.yearOfManufacture || 0,
      contactNumber: listing?.contactNumber || "",
      images: listing?.images || [],
    },
  });

  // Debug: log the form values and listing data
  console.log('Listing data:', listing);
  console.log('Form default values:', form.getValues());

  const isEditing = !!listing;

  useEffect(() => {
    console.log('Form map coordinates:', {
      latitude: form.getValues("latitude"),
      longitude: form.getValues("longitude"),
      parsedLatitude: parseFloat(form.getValues("latitude") || "0"),
      parsedLongitude: parseFloat(form.getValues("longitude") || "0")
    });
  }, [form.watch("latitude"), form.watch("longitude")]);

  useEffect(() => {
    if (listing) {
      form.reset({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price || 0,
        location: listing.location || "",
        latitude: listing.latitude || "0",
        longitude: listing.longitude || "0",
        type: (listing.type as "For Sale" | "For Rent") || "For Sale",
        owners: listing.owners || 0,
        wheels: listing.wheels || 0,
        yearOfManufacture: listing.yearOfManufacture || 0,
        contactNumber: listing.contactNumber || "",
        images: listing.images || [],
      });
      setSelectedImages(listing.images || []);
    }
  }, [listing]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertListing) => {
      return apiRequest("POST", "/api/listings", { ...data, images: selectedImages });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Listing created successfully!",
        description: "Your new listing is now available.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Failed to create listing",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertListing) => {
      return apiRequest("PUT", `/api/listings/${listing!.id}`, { ...data, images: selectedImages });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Listing updated successfully!",
        description: "Your changes have been saved.",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Failed to update listing",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertListing) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          setSelectedImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGeocode = async () => {
    const location = form.getValues("location");
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter an address to geocode",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(location);
      if (result) {
        form.setValue("latitude", result.lat);
        form.setValue("longitude", result.lon);
        toast({
          title: "Location found!",
          description: "The address has been mapped successfully",
        });
      } else {
        toast({
          title: "Location not found",
          description: "Could not find coordinates for this address",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Geocoding failed",
        description: "Failed to geocode the address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    form.reset();
    setSelectedImages([]);
    setIsGeocoding(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="listing-form-modal">
        <DialogHeader>
          <DialogTitle data-testid="listing-form-title">
            {isEditing ? "Edit Listing" : "Add New Listing"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Heavy vehicle title"
                data-testid="listing-title-input"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="type">Type *</Label>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger data-testid="listing-type-select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.type && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.type.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="0"
                data-testid="listing-price-input"
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="Vehicle location"
                  data-testid="listing-location-input"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleGeocode}
                  disabled={isGeocoding}
                  className="whitespace-nowrap"
                  data-testid="geocode-button"
                >
                  {isGeocoding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {isGeocoding ? "Locating..." : "Find on Map"}
                </Button>
              </div>
              {form.formState.errors.location && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
              )}
              <div className="mt-4 h-64">
                <PropertyMap
                  latitude={parseFloat(form.getValues("latitude") || "0")}
                  longitude={parseFloat(form.getValues("longitude") || "0")}
                  interactive={true}
                  onLocationSelect={(lat: number, lng: number) => {
                    form.setValue("latitude", lat.toString());
                    form.setValue("longitude", lng.toString());
                  }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="owners">Owners</Label>
              <Input
                id="owners"
                type="number"
                {...form.register("owners", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-owners-input"
              />
            </div>
            
            <div>
              <Label htmlFor="wheels">Wheels</Label>
              <Input
                id="wheels"
                type="number"
                step="0.5"
                {...form.register("wheels", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-wheels-input"
              />
            </div>
            
            <div>
              <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
              <Input
                id="yearOfManufacture"
                type="number"
                {...form.register("yearOfManufacture", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-yearOfManufacture-input"
              />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="text"
                {...form.register("contactNumber")}
                placeholder="Contact Number"
                data-testid="listing-contactNumber-input"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Detailed vehicle description"
              className="resize-none"
              data-testid="listing-description-input"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div>
            <Label>Images</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="listing-images"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                data-testid="listing-images-input"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('listing-images')?.click()}
                data-testid="upload-images-button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Images
              </Button>
              <p className="text-slate-500 text-sm mt-2">Upload multiple images (JPG, PNG)</p>

              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4" data-testid="image-preview-grid">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                        data-testid={`image-preview-${index}`}
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                        data-testid={`remove-image-${index}`}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              data-testid="listing-form-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="listing-form-submit"
            >
              {(createMutation.isPending || updateMutation.isPending)
                ? "Saving..."
                : isEditing
                ? "Update Listing"
                : "Save Listing"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
