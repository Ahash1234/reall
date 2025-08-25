import { type User, type InsertUser, type Listing, type InsertListing } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllListings(): Promise<Listing[]>;
  getListing(id: string): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: string, listing: Partial<InsertListing>): Promise<Listing | undefined>;
  deleteListing(id: string): Promise<boolean>;
  searchListings(query: string): Promise<Listing[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private listings: Map<string, Listing>;

  constructor() {
    this.users = new Map();
    this.listings = new Map();
    
    // Initialize with admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      password: "password"
    };
    this.users.set(adminId, admin);
    
    // Initialize with sample listings
    this.initializeSampleListings();
  }

  private initializeSampleListings() {
    const sampleListings: InsertListing[] = [
      {
        title: "Modern Downtown Loft",
        description: "Stunning 2-bedroom loft with floor-to-ceiling windows and premium finishes in the heart of downtown.",
        price: 850000,
        location: "Downtown District",
        type: "For Sale",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Charming Family Home",
        description: "Beautiful 4-bedroom home with landscaped garden, perfect for families seeking comfort and space.",
        price: 650000,
        location: "Westfield Suburbs",
        type: "For Sale",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2400,
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Oceanfront Condo",
        description: "Luxurious beachfront condo with panoramic ocean views and resort-style amenities.",
        price: 4200,
        location: "Coastal Heights",
        type: "For Rent",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1800,
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Trendy Studio Loft",
        description: "Stylish studio apartment in the arts district with exposed brick and modern amenities.",
        price: 2100,
        location: "Arts Quarter",
        type: "For Rent",
        bedrooms: 0,
        bathrooms: 1,
        sqft: 650,
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Executive Penthouse",
        description: "Prestigious penthouse suite with private terrace and unmatched city views.",
        price: 1200000,
        location: "Financial District",
        type: "For Sale",
        bedrooms: 3,
        bathrooms: 3,
        sqft: 2800,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Country Farmhouse",
        description: "Authentic farmhouse on 3 acres with wrap-around porch and mountain views.",
        price: 480000,
        location: "Countryside Valley",
        type: "For Sale",
        bedrooms: 5,
        bathrooms: 3,
        sqft: 3200,
        images: ["https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Modern Townhouse",
        description: "Contemporary 3-story townhouse with garage and private backyard in desirable neighborhood.",
        price: 3500,
        location: "Midtown Commons",
        type: "For Rent",
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1900,
        images: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      },
      {
        title: "Garden Cottage",
        description: "Charming cottage surrounded by mature gardens, perfect for those seeking tranquility.",
        price: 390000,
        location: "Rose Hill District",
        type: "For Sale",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        images: ["https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"]
      }
    ];

    sampleListings.forEach(listing => {
      this.createListing(listing);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllListings(): Promise<Listing[]> {
    return Array.from(this.listings.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getListing(id: string): Promise<Listing | undefined> {
    return this.listings.get(id);
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const id = randomUUID();
    const now = new Date();
    const listing: Listing = { 
      ...insertListing, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.listings.set(id, listing);
    return listing;
  }

  async updateListing(id: string, updates: Partial<InsertListing>): Promise<Listing | undefined> {
    const existing = this.listings.get(id);
    if (!existing) return undefined;
    
    const updated: Listing = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.listings.set(id, updated);
    return updated;
  }

  async deleteListing(id: string): Promise<boolean> {
    return this.listings.delete(id);
  }

  async searchListings(query: string): Promise<Listing[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.listings.values()).filter(listing =>
      listing.title.toLowerCase().includes(lowercaseQuery) ||
      listing.description.toLowerCase().includes(lowercaseQuery) ||
      listing.location.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const storage = new MemStorage();
