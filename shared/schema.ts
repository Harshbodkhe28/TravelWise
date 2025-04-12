import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("traveler"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Travel Agency model
export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  description: text("description"),
  websiteUrl: text("website_url"),
  phoneNumber: text("phone_number"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgencySchema = createInsertSchema(agencies).pick({
  userId: true,
  companyName: true,
  description: true,
  websiteUrl: true,
  phoneNumber: true,
});

// Destination model
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  bestTimeToVisit: text("best_time_to_visit"),
  avgTemperature: text("avg_temperature"),
  beachSeason: text("beach_season"),
  rainySeason: text("rainy_season"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDestinationSchema = createInsertSchema(destinations).pick({
  name: true,
  country: true,
  description: true,
  imageUrl: true,
  bestTimeToVisit: true,
  avgTemperature: true,
  beachSeason: true,
  rainySeason: true,
});

// Travel Preference model
export const travelPreferences = pgTable("travel_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  destinationId: integer("destination_id").references(() => destinations.id),
  additionalDestination: text("additional_destination"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  travelers: integer("travelers").default(1),
  budget: integer("budget"),
  specialRequests: text("special_requests"),
  preferences: jsonb("preferences"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTravelPreferenceSchema = createInsertSchema(travelPreferences).pick({
  userId: true,
  destinationId: true,
  additionalDestination: true,
  startDate: true,
  endDate: true,
  travelers: true,
  budget: true,
  specialRequests: true,
  preferences: true,
});

// Travel Package model
export const travelPackages = pgTable("travel_packages", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").notNull().references(() => agencies.id),
  preferenceId: integer("preference_id").references(() => travelPreferences.id),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  pricePerPerson: boolean("price_per_person").default(true),
  accommodation: text("accommodation"),
  transportation: text("transportation"),
  meals: text("meals"),
  activities: text("activities"),
  additionalInfo: text("additional_info"),
  packageType: text("package_type").default("standard"), // standard, premium, budget
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTravelPackageSchema = createInsertSchema(travelPackages).pick({
  agencyId: true,
  preferenceId: true,
  title: true,
  description: true,
  price: true,
  pricePerPerson: true,
  accommodation: true,
  transportation: true,
  meals: true,
  activities: true,
  additionalInfo: true,
  packageType: true,
});

// Message model
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  senderId: true,
  receiverId: true,
  content: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAgency = z.infer<typeof insertAgencySchema>;
export type Agency = typeof agencies.$inferSelect;

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertTravelPreference = z.infer<typeof insertTravelPreferenceSchema>;
export type TravelPreference = typeof travelPreferences.$inferSelect;

export type InsertTravelPackage = z.infer<typeof insertTravelPackageSchema>;
export type TravelPackage = typeof travelPackages.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  agencies: many(agencies),
  travelPreferences: many(travelPreferences),
  sentMessages: many(messages, { relationName: 'senderMessages' }),
  receivedMessages: many(messages, { relationName: 'receiverMessages' }),
}));

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  user: one(users, { fields: [agencies.userId], references: [users.id] }),
  travelPackages: many(travelPackages),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  travelPreferences: many(travelPreferences),
}));

export const travelPreferencesRelations = relations(travelPreferences, ({ one, many }) => ({
  user: one(users, { fields: [travelPreferences.userId], references: [users.id] }),
  destination: one(destinations, { fields: [travelPreferences.destinationId], references: [destinations.id] }),
  travelPackages: many(travelPackages),
}));

export const travelPackagesRelations = relations(travelPackages, ({ one }) => ({
  agency: one(agencies, { fields: [travelPackages.agencyId], references: [agencies.id] }),
  preference: one(travelPreferences, { fields: [travelPackages.preferenceId], references: [travelPreferences.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id], relationName: 'senderMessages' }),
  receiver: one(users, { fields: [messages.receiverId], references: [users.id], relationName: 'receiverMessages' }),
}));
