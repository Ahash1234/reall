import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Listing } from "@shared/schema";
import { Navigation } from "@/components/navigation";
import { ListingCard } from "@/components/listing-card";
import { ListingDetailsModal } from "@/components/listing-details-modal";
import { ContactModal } from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid, List } from "lucide-react";
import { useLocation } from "wouter";

type ViewType = "grid" | "list";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [contactListing, setContactListing] = useState<Listing | null>(null);

  const { data: listings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const featuredListings = listings.slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
              Find Your Perfect Property
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto" data-testid="hero-subtitle">
              Discover premium listings from trusted sellers in your area. Whether you're buying, selling, or just browsing, we've got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Search by title, location, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      data-testid="hero-search-input"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold"
                    data-testid="hero-search-button"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Listings Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4" data-testid="featured-title">
              Featured Listings
            </h3>
            <p className="text-xl text-slate-600" data-testid="featured-subtitle">
              Discover our handpicked selection of premium properties
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-slate-600" data-testid="listing-count">
              <span>{featuredListings.length}</span> properties found
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("grid")}
                className={viewType === "grid" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}
                data-testid="grid-view-button"
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewType("list")}
                className={viewType === "list" ? "bg-white text-slate-700 shadow-sm" : "text-slate-500"}
                data-testid="list-view-button"
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm animate-pulse">
                  <div className="h-48 bg-slate-200 rounded-t-xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings.length === 0 ? (
            <div className="text-center py-12" data-testid="no-listings-message">
              <p className="text-slate-600">No listings available at the moment.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewType === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`} data-testid="listings-grid">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onClick={() => setSelectedListing(listing)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ListingDetailsModal
        listing={selectedListing}
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        onContact={(listing) => {
          setSelectedListing(null);
          setContactListing(listing);
        }}
      />

      <ContactModal
        listing={contactListing}
        isOpen={!!contactListing}
        onClose={() => setContactListing(null)}
      />
    </div>
  );
}
