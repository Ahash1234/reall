import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Listing } from "@shared/schema";
import { Navigation } from "@/components/navigation";
import { ListingFormModal } from "@/components/listing-form-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Home, DollarSign, Key, TrendingUp, Edit, Trash2, LogOut } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | undefined>();

  // Check authentication
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      toast({
        title: "Listing deleted successfully!",
        description: "The listing has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete listing",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setIsFormOpen(true);
  };

  const handleDelete = (listing: Listing) => {
    if (confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      deleteMutation.mutate(listing.id);
    }
  };

  const handleAddNew = () => {
    setEditingListing(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingListing(undefined);
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

  // Calculate stats
  const totalListings = listings.length;
  const forSaleCount = listings.filter(l => l.type === "For Sale").length;
  const forRentCount = listings.filter(l => l.type === "For Rent").length;
  const avgPrice = listings.length > 0 
    ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900" data-testid="dashboard-title">
                Admin Dashboard
              </h2>
              <p className="text-slate-600 mt-2" data-testid="dashboard-subtitle">
                Manage your property listings
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Home className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Listings</p>
                    <p className="text-2xl font-semibold text-slate-900" data-testid="total-listings-stat">
                      {totalListings}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">For Sale</p>
                    <p className="text-2xl font-semibold text-slate-900" data-testid="for-sale-stat">
                      {forSaleCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">For Rent</p>
                    <p className="text-2xl font-semibold text-slate-900" data-testid="for-rent-stat">
                      {forRentCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Avg. Price</p>
                    <p className="text-2xl font-semibold text-slate-900" data-testid="avg-price-stat">
                      ${avgPrice > 0 ? `${Math.round(avgPrice / 1000)}K` : "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dashboard Actions */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900" data-testid="manage-listings-title">
              Manage Listings
            </h3>
            <Button
              onClick={handleAddNew}
              className="bg-primary-600 hover:bg-primary-700 text-white"
              data-testid="add-listing-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
          </div>
          
          {/* Listings Table */}
          <Card>
            <CardHeader>
              <CardTitle data-testid="current-listings-title">Current Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
                      <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-8" data-testid="no-listings-dashboard">
                  <Home className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No listings available. Add your first listing to get started.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing) => (
                        <TableRow key={listing.id} data-testid={`listing-row-${listing.id}`}>
                          <TableCell>
                            <div className="flex items-center">
                              <img
                                src={listing.images[0] || "/placeholder-image.jpg"}
                                alt={listing.title}
                                className="h-12 w-12 rounded-lg object-cover mr-4"
                                data-testid={`listing-table-image-${listing.id}`}
                              />
                              <div>
                                <div className="text-sm font-medium text-slate-900" data-testid={`listing-table-title-${listing.id}`}>
                                  {listing.title}
                                </div>
                                <div className="text-sm text-slate-500" data-testid={`listing-table-details-${listing.id}`}>
                                  {listing.bedrooms || 0} bed, {listing.bathrooms || 0} bath
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getBadgeColor(listing.type)} data-testid={`listing-table-type-${listing.id}`}>
                              {listing.type}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`listing-table-price-${listing.id}`}>
                            ${listing.price.toLocaleString()}
                          </TableCell>
                          <TableCell data-testid={`listing-table-location-${listing.id}`}>
                            {listing.location}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(listing)}
                                data-testid={`edit-listing-${listing.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(listing)}
                                disabled={deleteMutation.isPending}
                                data-testid={`delete-listing-${listing.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Listing Form Modal */}
      <ListingFormModal
        listing={editingListing}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </div>
  );
}
