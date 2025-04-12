import { 
  users, User, InsertUser, 
  agencies, Agency, InsertAgency,
  destinations, Destination, InsertDestination,
  travelPreferences, TravelPreference, InsertTravelPreference,
  travelPackages, TravelPackage, InsertTravelPackage,
  messages, Message, InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { client } from "./db";
import memorystore from "memorystore";

// Create a PostgreSQL-based session store
const PostgresSessionStore = connectPg(session);
const MemoryStore = memorystore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Agency management
  getAgency(id: number): Promise<Agency | undefined>;
  getAgencyByUserId(userId: number): Promise<Agency | undefined>;
  getAllAgencies(): Promise<Agency[]>;
  createAgency(agency: InsertAgency): Promise<Agency>;
  updateAgency(id: number, agency: Partial<Agency>): Promise<Agency | undefined>;
  
  // Destination management
  getDestination(id: number): Promise<Destination | undefined>;
  getAllDestinations(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: number, destination: Partial<Destination>): Promise<Destination | undefined>;
  seedDestinations(): Promise<void>;
  
  // Travel Preference management
  getTravelPreference(id: number): Promise<TravelPreference | undefined>;
  getTravelPreferencesByUserId(userId: number): Promise<TravelPreference[]>;
  getAllTravelPreferences(): Promise<TravelPreference[]>;
  createTravelPreference(preference: InsertTravelPreference): Promise<TravelPreference>;
  updateTravelPreference(id: number, preference: Partial<TravelPreference>): Promise<TravelPreference | undefined>;
  
  // Travel Package management
  getTravelPackage(id: number): Promise<TravelPackage | undefined>;
  getTravelPackagesByAgencyId(agencyId: number): Promise<TravelPackage[]>;
  getTravelPackagesByPreferenceId(preferenceId: number): Promise<TravelPackage[]>;
  createTravelPackage(travelPackage: InsertTravelPackage): Promise<TravelPackage>;
  updateTravelPackage(id: number, travelPackage: Partial<TravelPackage>): Promise<TravelPackage | undefined>;
  
  // Message management
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getMessagesByUserId(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  sessionStore: any; // Using 'any' to avoid TypeScript issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using 'any' to avoid TypeScript issues

  constructor() {
    // Use memory store for sessions instead of PostgreSQL
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with sample destinations
    this.seedDestinations();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Agency methods
  async getAgency(id: number): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency;
  }
  
  async getAgencyByUserId(userId: number): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.userId, userId));
    return agency;
  }
  
  async getAllAgencies(): Promise<Agency[]> {
    return await db.select().from(agencies);
  }
  
  async createAgency(insertAgency: InsertAgency): Promise<Agency> {
    const [agency] = await db.insert(agencies).values(insertAgency).returning();
    return agency;
  }
  
  async updateAgency(id: number, agencyData: Partial<Agency>): Promise<Agency | undefined> {
    const [agency] = await db
      .update(agencies)
      .set(agencyData)
      .where(eq(agencies.id, id))
      .returning();
    return agency;
  }

  // Destination methods
  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }
  
  async getAllDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }
  
  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const [destination] = await db.insert(destinations).values(insertDestination).returning();
    return destination;
  }
  
  async updateDestination(id: number, destinationData: Partial<Destination>): Promise<Destination | undefined> {
    const [destination] = await db
      .update(destinations)
      .set(destinationData)
      .where(eq(destinations.id, id))
      .returning();
    return destination;
  }

  // Travel Preference methods
  async getTravelPreference(id: number): Promise<TravelPreference | undefined> {
    const [preference] = await db.select().from(travelPreferences).where(eq(travelPreferences.id, id));
    return preference;
  }
  
  async getTravelPreferencesByUserId(userId: number): Promise<TravelPreference[]> {
    return await db.select().from(travelPreferences).where(eq(travelPreferences.userId, userId));
  }
  
  async getAllTravelPreferences(): Promise<TravelPreference[]> {
    return await db.select().from(travelPreferences).orderBy(travelPreferences.createdAt);
  }
  
  async createTravelPreference(insertPreference: InsertTravelPreference): Promise<TravelPreference> {
    const [preference] = await db.insert(travelPreferences).values(insertPreference).returning();
    return preference;
  }
  
  async updateTravelPreference(id: number, preferenceData: Partial<TravelPreference>): Promise<TravelPreference | undefined> {
    const [preference] = await db
      .update(travelPreferences)
      .set(preferenceData)
      .where(eq(travelPreferences.id, id))
      .returning();
    return preference;
  }

  // Travel Package methods
  async getTravelPackage(id: number): Promise<TravelPackage | undefined> {
    const [travelPackage] = await db.select().from(travelPackages).where(eq(travelPackages.id, id));
    return travelPackage;
  }
  
  async getTravelPackagesByAgencyId(agencyId: number): Promise<TravelPackage[]> {
    return await db.select().from(travelPackages).where(eq(travelPackages.agencyId, agencyId));
  }
  
  async getTravelPackagesByPreferenceId(preferenceId: number): Promise<TravelPackage[]> {
    return await db.select().from(travelPackages).where(eq(travelPackages.preferenceId, preferenceId));
  }
  
  async createTravelPackage(insertPackage: InsertTravelPackage): Promise<TravelPackage> {
    const [travelPackage] = await db.insert(travelPackages).values(insertPackage).returning();
    return travelPackage;
  }
  
  async updateTravelPackage(id: number, packageData: Partial<TravelPackage>): Promise<TravelPackage | undefined> {
    const [travelPackage] = await db
      .update(travelPackages)
      .set(packageData)
      .where(eq(travelPackages.id, id))
      .returning();
    return travelPackage;
  }

  // Message methods
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }
  
  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(
        and(
          eq(messages.senderId, user1Id),
          eq(messages.receiverId, user2Id)
        ),
        and(
          eq(messages.senderId, user2Id),
          eq(messages.receiverId, user1Id)
        )
      )
    ).orderBy(messages.createdAt);
  }
  
  async getMessagesByUserId(userId: number): Promise<Message[]> {
    return await db.select().from(messages).where(
      or(
        eq(messages.senderId, userId),
        eq(messages.receiverId, userId)
      )
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
  
  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [message] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }
  
  // Seed destinations data
  async seedDestinations() {
    // Check if destinations already exist
    const existingDestinations = await db.select().from(destinations);
    if (existingDestinations.length > 0) {
      return; // Don't seed if data already exists
    }
    
    const destinationsData: InsertDestination[] = [
      {
        name: "Goa",
        country: "India",
        description: "Famous beach destination with golden sands, vibrant nightlife, Portuguese architecture, and water sports.",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Nov-Feb",
        avgTemperature: "29°C (84°F)",
        beachSeason: "Oct-Mar",
        rainySeason: "June to September"
      },
      {
        name: "Kerala",
        country: "India",
        description: "God's own country featuring serene backwaters, lush green landscapes, Ayurvedic treatments, and rich culture.",
        imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Sep-Mar",
        avgTemperature: "28°C (82°F)",
        beachSeason: "Oct-Feb",
        rainySeason: "June to August"
      },
      {
        name: "Rajasthan",
        country: "India",
        description: "Land of kings with majestic forts, vibrant culture, colorful festivals, and vast desert landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1599661046827-9a64ae016537?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Mar",
        avgTemperature: "25°C (77°F)",
        beachSeason: "N/A",
        rainySeason: "July to September"
      },
      {
        name: "Hampi",
        country: "India",
        description: "UNESCO World Heritage site with ancient ruins, magnificent temples, and boulder-strewn landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1571536802807-30aa00c0e864?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Feb",
        avgTemperature: "27°C (81°F)",
        beachSeason: "N/A",
        rainySeason: "June to September"
      },
      {
        name: "Pondicherry",
        country: "India",
        description: "Former French colony with charming colonial architecture, peaceful beaches, and spiritual ambiance.",
        imageUrl: "https://images.unsplash.com/photo-1582810803949-3e40d51e1c2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Mar",
        avgTemperature: "30°C (86°F)",
        beachSeason: "Nov-Feb",
        rainySeason: "October to December"
      },
      {
        name: "Gokarna",
        country: "India",
        description: "Serene coastal town with pristine beaches, temple trails, and a laid-back hippie vibe.",
        imageUrl: "https://images.unsplash.com/photo-1623853476319-21c484f856fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Mar",
        avgTemperature: "28°C (82°F)",
        beachSeason: "Nov-Feb",
        rainySeason: "June to September"
      },
      {
        name: "Kanyakumari",
        country: "India",
        description: "India's southernmost tip where three oceans meet, with spectacular sunrises and sunsets.",
        imageUrl: "https://images.unsplash.com/photo-1624867903645-809450dc647c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Feb",
        avgTemperature: "30°C (86°F)",
        beachSeason: "Nov-Feb",
        rainySeason: "June to September"
      },
      {
        name: "Varanasi",
        country: "India",
        description: "One of the world's oldest living cities, with sacred ghats, ancient temples, and spiritual experiences.",
        imageUrl: "https://images.unsplash.com/photo-1561361058-c24cecda1510?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        bestTimeToVisit: "Oct-Mar",
        avgTemperature: "25°C (77°F)",
        beachSeason: "N/A",
        rainySeason: "July to September"
      }
    ];
    
    await db.insert(destinations).values(destinationsData);
  }
}

export const storage = new DatabaseStorage();
