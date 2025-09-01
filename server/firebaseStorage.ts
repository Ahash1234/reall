import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, push, query, orderByChild, equalTo, update } from "firebase/database";
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

// Complete Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC56P2kOni2ejBebs6ft3-wLk25i7lG1KE",
  authDomain: "heavy-82776.firebaseapp.com",
  databaseURL: "https://heavy-82776-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heavy-82776",
  storageBucket: "heavy-82776.firebasestorage.app",
  messagingSenderId: "322012290556",
  appId: "1:322012290556:web:53962170a05cd33cd26679",
  measurementId: "G-38TVZVYMVR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export class FirebaseStorage implements IStorage {
  constructor() {
    // Initialize Firebase connection
    console.log("Firebase Storage initialized");
  }

  private getUsersRef() {
    return ref(database, 'users');
  }

  private getListingsRef() {
    return ref(database, 'listings');
  }

  private getUserRef(id: string) {
    return ref(database, `users/${id}`);
  }

  private getListingRef(id: string) {
    return ref(database, `listings/${id}`);
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const snapshot = await get(this.getUserRef(id));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersRef = this.getUsersRef();
      const q = query(usersRef, orderByChild('username'), equalTo(username));
      const snapshot = await get(q);
      
      if (snapshot.exists()) {
        const users = snapshot.val();
        // Find the first user with matching username
        for (const userId in users) {
          if (users[userId].username === username) {
            return users[userId];
          }
        }
      }
      return undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const user: User = { ...insertUser, id };
      await set(this.getUserRef(id), user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getAllListings(): Promise<Listing[]> {
    try {
      const snapshot = await get(this.getListingsRef());
      if (snapshot.exists()) {
        const listings = snapshot.val();
        return Object.values(listings).sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ) as Listing[];
      }
      return [];
    } catch (error) {
      console.error("Error getting all listings:", error);
      throw error;
    }
  }

  async getListing(id: string): Promise<Listing | undefined> {
    try {
      const snapshot = await get(this.getListingRef(id));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return undefined;
    } catch (error) {
      console.error("Error getting listing:", error);
      throw error;
    }
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    try {
      const id = randomUUID();
      const now = new Date();
      const listing: Listing = { 
        ...insertListing,
        id, 
        createdAt: now,
        updatedAt: now,
        bedrooms: insertListing.bedrooms ?? null,
        bathrooms: insertListing.bathrooms ?? null,
        sqft: insertListing.sqft ?? null,
        images: insertListing.images ?? null
      };
      await set(this.getListingRef(id), listing);
      return listing;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw error;
    }
  }

  async updateListing(id: string, updates: Partial<InsertListing>): Promise<Listing | undefined> {
    try {
      const existing = await this.getListing(id);
      if (!existing) return undefined;
      
      const updated: Listing = {
        ...existing,
        ...updates,
        updatedAt: new Date(),
        bedrooms: updates.bedrooms ?? existing.bedrooms,
        bathrooms: updates.bathrooms ?? existing.bathrooms,
        sqft: updates.sqft ?? existing.sqft,
        images: updates.images ?? existing.images
      };
      
      await update(this.getListingRef(id), updated);
      return updated;
    } catch (error) {
      console.error("Error updating listing:", error);
      throw error;
    }
  }

  async deleteListing(id: string): Promise<boolean> {
    try {
      const listingRef = this.getListingRef(id);
      await remove(listingRef);
      return true;
    } catch (error) {
      console.error("Error deleting listing:", error);
      throw error;
    }
  }

  async searchListings(searchQuery: string): Promise<Listing[]> {
    try {
      const allListings = await this.getAllListings();
      const lowercaseQuery = searchQuery.toLowerCase();
      
      return allListings.filter(listing =>
        listing.title.toLowerCase().includes(lowercaseQuery) ||
        listing.description.toLowerCase().includes(lowercaseQuery) ||
        listing.location.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error("Error searching listings:", error);
      throw error;
    }
  }
}

export const firebaseStorage = new FirebaseStorage();
