import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema } from "@shared/schema";
import { type InsertListing, type Listing } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useState } from "react";

interface ListingFormModalProps {
  listing?: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function ListingFormModal({ listing, isOpen, onClose }: ListingFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<string[]>(listing?.images || []);
  
  const form = useForm<InsertListing>({
    resolver: zodResolver(insertListingSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price || 0,
      location: listing?.location || "",
      type: listing?.type || "",
      bedrooms: listing?.bedrooms || 0,
      bathrooms: listing?.bathrooms || 0,
      sqft: listing?.sqft || 0,
      images: listing?.images || [],
    },
  });

  const isEditing = !!listing;

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

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    form.reset();
    setSelectedImages([]);
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
                placeholder="Property title"
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
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Property location"
                data-testid="listing-location-input"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                {...form.register("bedrooms", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-bedrooms-input"
              />
            </div>
            
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                {...form.register("bathrooms", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-bathrooms-input"
              />
            </div>
            
            <div>
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                {...form.register("sqft", { valueAsNumber: true })}
                placeholder="0"
                min="0"
                data-testid="listing-sqft-input"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              rows={4}
              placeholder="Detailed property description"
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
