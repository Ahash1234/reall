import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Listing } from "@shared/schema";
import { Navigation } from "@/components/navigation";
import { ListingCard } from "@/components/listing-card";
import { ListingDetailsModal } from "@/components/listing-details-modal";
import { ContactModal } from "@/components/contact-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Grid, List, Search } from "lucide-react";
import { useLocation, useSearch } from "wouter";

type ViewType = "grid" | "list";

export default function SearchPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const urlParams = new URLSearchParams(search);
  const initialQuery = urlParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("");
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [contactListing, setContactListing] = useState<Listing | null>(null);

  const { data: allListings = [], isLoading } = useQuery<Listing[]>({
    queryKey: ["/api/listings"],
  });

  const { data: searchResults = [], isLoading: isSearching } = useQuery<Listing[]>({
    queryKey: ["/api/listings/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/listings/search/${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: !!searchQuery.trim(),
  });

  const filteredListings = (searchQuery.trim() ? searchResults : allListings).filter(listing => {
    if (typeFilter && listing.type !== typeFilter) return false;
    
    if (priceFilter) {
      const price = listing.price;
      switch (priceFilter) {
        case "under-500k":
          if (price >= 500000) return false;
          break;
        case "500k-1m":
          if (price < 500000 || price > 1000000) return false;
          break;
        case "above-1m":
          if (price <= 1000000) return false;
          break;
      }
    }
    
    if (bedroomFilter) {
      const bedrooms = listing.bedrooms || 0;
      switch (bedroomFilter) {
        case "studio":
          if (bedrooms !== 0) return false;
          break;
        case "1+":
          if (bedrooms < 1) return false;
          break;
        case "2+":
          if (bedrooms < 2) return false;
          break;
        case "3+":
          if (bedrooms < 3) return false;
          break;
        case "4+":
          if (bedrooms < 4) return false;
          break;
      }
    }
    
    return true;
  });

  const handleApplyFilters = () => {
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (typeFilter) params.set("type", typeFilter);
    if (priceFilter) params.set("price", priceFilter);
    if (bedroomFilter) params.set("bedrooms", bedroomFilter);
    
    const queryString = params.toString();
    navigate(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setPriceFilter("");
    setBedroomFilter("");
    navigate("/search");
  };

  // Load filters from URL on component mount
  useEffect(() => {
    setTypeFilter(urlParams.get("type") || "");
    setPriceFilter(urlParams.get("price") || "");
    setBedroomFilter(urlParams.get("bedrooms") || "");
  }, [search]);

  const activeFilters = [typeFilter, priceFilter, bedroomFilter, searchQuery.trim()].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4" data-testid="search-page-title">
              Browse All Properties
            </h2>
            
            {/* Advanced Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Search</Label>
                  <Input
                    type="text"
                    placeholder="Title, location, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="search-input"
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger data-testid="type-filter">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Price Range</Label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger data-testid="price-filter">
                      <SelectValue placeholder="Any Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Price</SelectItem>
                      <SelectItem value="under-500k">Under $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="above-1m">Above $1M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-slate-700 mb-2">Bedrooms</Label>
                  <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                    <SelectTrigger data-testid="bedroom-filter">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="1+">1+</SelectItem>
                      <SelectItem value="2+">2+</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  {activeFilters > 0 && (
                    <span data-testid="active-filters-count">
                      {activeFilters} filter{activeFilters > 1 ? "s" : ""} applied
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {activeFilters > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      data-testid="clear-filters-button"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={handleApplyFilters}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    data-testid="apply-filters-button"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* View Toggle and Results Count */}
            <div className="flex justify-between items-center mb-8">
              <div className="text-slate-600" data-testid="results-count">
                <span>{filteredListings.length}</span> properties found
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
            
            {/* Search Results */}
            {isLoading || isSearching ? (
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
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12" data-testid="no-results-message">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No properties found</p>
                <p className="text-slate-500">Try adjusting your search criteria or clearing filters</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewType === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`} data-testid="search-results-grid">
                {filteredListings.map((listing) => (
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
