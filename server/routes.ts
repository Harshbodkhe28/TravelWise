import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { db } from "./db";
import {
  insertTravelPreferenceSchema,
  insertTravelPackageSchema,
  insertMessageSchema,
  destinations
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get all destinations
  app.get("/api/destinations", async (req, res) => {
    const destinations = await storage.getAllDestinations();
    res.json(destinations);
  });
  
  // Seed destinations (admin route)
  app.post("/api/destinations/seed", async (req, res) => {
    try {
      // Delete existing destinations
      await db.delete(destinations);
      // Seed Indian destinations
      await storage.seedDestinations();
      res.status(200).json({ message: "Destinations seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed destinations", error });
    }
  });

  // Get a single destination
  app.get("/api/destinations/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid destination ID" });
    }

    const destination = await storage.getDestination(id);
    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json(destination);
  });

  // Get all agencies
  app.get("/api/agencies", async (req, res) => {
    const agencies = await storage.getAllAgencies();
    res.json(agencies);
  });

  // Get a single agency
  app.get("/api/agencies/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agency ID" });
    }

    const agency = await storage.getAgency(id);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    res.json(agency);
  });
  
  // Get all users (accessible only to agencies)
  app.get("/api/users", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "agency") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await storage.getAllUsers();
    // Only return necessary info for privacy
    const safeUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email
    }));
    res.json(safeUsers);
  });

  // Create a travel agency profile
  app.post("/api/agencies", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Check if user already has an agency
      const existingAgency = await storage.getAgencyByUserId(req.user!.id);
      if (existingAgency) {
        return res.status(400).json({ message: "User already has an agency profile" });
      }

      const agencyData = {
        userId: req.user!.id,
        companyName: req.body.companyName,
        description: req.body.description || "",
        websiteUrl: req.body.websiteUrl || "",
        phoneNumber: req.body.phoneNumber || "",
      };

      const agency = await storage.createAgency(agencyData);
      
      // Update user role
      await storage.updateUser(req.user!.id, { role: "agency" });

      res.status(201).json(agency);
    } catch (error) {
      res.status(400).json({ message: "Invalid agency data" });
    }
  });

  // Get current user's agency profile
  app.get("/api/my-agency", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const agency = await storage.getAgencyByUserId(req.user!.id);
    if (!agency) {
      return res.status(404).json({ message: "Agency profile not found" });
    }

    res.json(agency);
  });
  
  // Update current user's agency profile (or create if it doesn't exist)
  app.patch("/api/my-agency", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "agency") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Check if user already has an agency profile
      let agency = await storage.getAgencyByUserId(req.user!.id);
      
      if (!agency) {
        // Create a new agency profile
        const agencyData = {
          userId: req.user!.id,
          companyName: req.body.companyName,
          description: req.body.description || "",
          websiteUrl: req.body.websiteUrl || "",
          phoneNumber: req.body.phoneNumber || "",
        };
        
        agency = await storage.createAgency(agencyData);
      } else {
        // Update existing agency profile
        agency = await storage.updateAgency(agency.id, {
          companyName: req.body.companyName,
          description: req.body.description,
          websiteUrl: req.body.websiteUrl,
          phoneNumber: req.body.phoneNumber,
        });
      }
      
      res.status(200).json(agency);
    } catch (error) {
      console.error("Error updating agency profile:", error);
      res.status(400).json({ message: "Invalid agency data" });
    }
  });

  // Get all travel preferences for the current user
  app.get("/api/travel-preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user!.role === "agency") {
      // For agencies, return all travel preferences from all users
      const preferences = await storage.getAllTravelPreferences();
      res.json(preferences);
    } else {
      // For regular users, only return their own preferences
      const preferences = await storage.getTravelPreferencesByUserId(req.user!.id);
      res.json(preferences);
    }
  });

  // Create a travel preference
  app.post("/api/travel-preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Parse dates from ISO strings
      const reqData = {
        ...req.body,
        userId: req.user!.id,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
      };
      
      const validatedData = insertTravelPreferenceSchema.parse(reqData);
      
      const preference = await storage.createTravelPreference(validatedData);
      res.status(201).json(preference);
    } catch (error) {
      console.error("Travel preference error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid travel preference data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid travel preference data" });
    }
  });

  // Get travel packages for a specific preference
  app.get("/api/travel-preferences/:id/packages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const preferenceId = parseInt(req.params.id);
    if (isNaN(preferenceId)) {
      return res.status(400).json({ message: "Invalid preference ID" });
    }

    // Verify the preference belongs to the user
    const preference = await storage.getTravelPreference(preferenceId);
    if (!preference || preference.userId !== req.user!.id) {
      return res.status(404).json({ message: "Preference not found" });
    }

    const packages = await storage.getTravelPackagesByPreferenceId(preferenceId);
    res.json(packages);
  });
  
  // Get all travel packages for an agency
  app.get("/api/agency-packages", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "agency") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const agency = await storage.getAgencyByUserId(req.user!.id);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    const packages = await storage.getTravelPackagesByAgencyId(agency.id);
    res.json(packages);
  });

  // Create a travel package
  app.post("/api/travel-packages", async (req, res) => {
    if (!req.isAuthenticated() || req.user!.role !== "agency") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const agency = await storage.getAgencyByUserId(req.user!.id);
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }

      const validatedData = insertTravelPackageSchema.parse({
        ...req.body,
        agencyId: agency.id
      });
      
      const travelPackage = await storage.createTravelPackage(validatedData);
      res.status(201).json(travelPackage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid travel package data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid travel package data" });
    }
  });

  // Get messages between current user and another user
  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const otherUserId = parseInt(req.params.userId);
    if (isNaN(otherUserId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const messages = await storage.getMessagesBetweenUsers(req.user!.id, otherUserId);
    res.json(messages);
  });

  // Send a message
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const validatedData = insertMessageSchema.parse({
        senderId: req.user!.id,
        receiverId: req.body.receiverId,
        content: req.body.content
      });
      
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Mark a message as read
  app.patch("/api/messages/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const messageId = parseInt(req.params.id);
    if (isNaN(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await storage.getMessage(messageId);
    if (!message || message.receiverId !== req.user!.id) {
      return res.status(404).json({ message: "Message not found" });
    }

    const updatedMessage = await storage.markMessageAsRead(messageId);
    res.json(updatedMessage);
  });

  const httpServer = createServer(app);
  return httpServer;
}
