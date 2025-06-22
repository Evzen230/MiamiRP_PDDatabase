import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertCitizenSchema, insertVehicleSchema, insertDriverLicenseSchema,
  insertBusinessSchema, insertPropertySchema, insertPermitSchema,
  insertCriminalRecordSchema, insertUserSchema
} from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Citizens routes
  app.get("/api/citizens", requireAuth, async (req, res) => {
    try {
      const citizens = await storage.getAllCitizens();
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch citizens" });
    }
  });

  app.get("/api/citizens/search", requireAuth, async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const citizens = await storage.searchCitizens(query);
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  app.get("/api/citizens/wanted", requireAuth, async (req, res) => {
    try {
      const citizens = await storage.getWantedCitizens();
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wanted citizens" });
    }
  });

  app.post("/api/citizens", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertCitizenSchema.parse({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });
      const citizen = await storage.createCitizen(validatedData);
      res.status(201).json(citizen);
    } catch (error) {
      res.status(400).json({ message: "Invalid citizen data" });
    }
  });

  app.put("/api/citizens/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertCitizenSchema.partial().parse({
        ...req.body,
        updatedBy: req.user?.id
      });
      const citizen = await storage.updateCitizen(parseInt(req.params.id), validatedData);
      if (!citizen) {
        return res.status(404).json({ message: "Citizen not found" });
      }
      res.json(citizen);
    } catch (error) {
      res.status(400).json({ message: "Invalid citizen data" });
    }
  });

  app.delete("/api/citizens/:id", requireAuth, requireRole(["IT"]), async (req, res) => {
    try {
      const success = await storage.deleteCitizen(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Citizen not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete citizen" });
    }
  });

  // Vehicles routes
  app.get("/api/vehicles", requireAuth, requireRole(["DMV", "MPD", "FHP", "FSD", "IT"]), async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/search", requireAuth, requireRole(["DMV", "MPD", "FHP", "FSD", "IT"]), async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      const vehicles = await storage.searchVehicles(query);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  app.post("/api/vehicles", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });
      const vehicle = await storage.createVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ message: "Invalid vehicle data" });
    }
  });

  app.put("/api/vehicles/:id", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.partial().parse({
        ...req.body,
        updatedBy: req.user?.id
      });
      const vehicle = await storage.updateVehicle(parseInt(req.params.id), validatedData);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(400).json({ message: "Invalid vehicle data" });
    }
  });

  // Criminal records routes
  app.get("/api/criminal-records", requireAuth, requireRole(["MPD", "FHP", "FSD", "ICE", "IT"]), async (req, res) => {
    try {
      const records = await storage.getAllCriminalRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch criminal records" });
    }
  });

  app.get("/api/criminal-records/citizen/:citizenId", requireAuth, async (req, res) => {
    try {
      const records = await storage.getCriminalRecordsByCitizen(parseInt(req.params.citizenId));
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch citizen criminal records" });
    }
  });

  app.post("/api/criminal-records", requireAuth, requireRole(["MPD", "FHP", "FSD", "ICE", "IT"]), async (req, res) => {
    try {
      const validatedData = insertCriminalRecordSchema.parse({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });
      const record = await storage.createCriminalRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid criminal record data" });
    }
  });

  app.put("/api/criminal-records/:id", requireAuth, requireRole(["MPD", "FHP", "FSD", "ICE", "IT"]), async (req, res) => {
    try {
      const validatedData = insertCriminalRecordSchema.partial().parse({
        ...req.body,
        updatedBy: req.user?.id
      });
      const record = await storage.updateCriminalRecord(parseInt(req.params.id), validatedData);
      if (!record) {
        return res.status(404).json({ message: "Criminal record not found" });
      }
      res.json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid criminal record data" });
    }
  });

  // Businesses routes
  app.get("/api/businesses", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.post("/api/businesses", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data" });
    }
  });

  app.put("/api/businesses/:id", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.partial().parse({
        ...req.body,
        updatedBy: req.user?.id
      });
      const business = await storage.updateBusiness(parseInt(req.params.id), validatedData);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data" });
    }
  });

  // Properties routes
  app.get("/api/properties", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post("/api/properties", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id
      });
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  app.put("/api/properties/:id", requireAuth, requireRole(["IRS", "IT"]), async (req, res) => {
    try {
      const validatedData = insertPropertySchema.partial().parse({
        ...req.body,
        updatedBy: req.user?.id
      });
      const property = await storage.updateProperty(parseInt(req.params.id), validatedData);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  // Permits routes
  app.get("/api/permits", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const permits = await storage.getAllPermits();
      res.json(permits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permits" });
    }
  });

  app.post("/api/permits", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertPermitSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      const permit = await storage.createPermit(validatedData);
      res.status(201).json(permit);
    } catch (error) {
      res.status(400).json({ message: "Invalid permit data" });
    }
  });

  // Driver licenses routes
  app.get("/api/driver-licenses/citizen/:citizenId", requireAuth, requireRole(["DMV", "MPD", "FHP", "FSD", "IT"]), async (req, res) => {
    try {
      const licenses = await storage.getDriverLicensesByCitizen(parseInt(req.params.citizenId));
      res.json(licenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch driver licenses" });
    }
  });

  app.post("/api/driver-licenses", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertDriverLicenseSchema.parse(req.body);
      const license = await storage.createDriverLicense(validatedData);
      res.status(201).json(license);
    } catch (error) {
      res.status(400).json({ message: "Invalid driver license data" });
    }
  });

  // User management routes (Directors and IT only)
  app.get("/api/users", requireAuth, requireRole(["Director_MPD", "Director_FHP", "Director_FSD", "IT"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAuth, requireRole(["Director_MPD", "Director_FHP", "Director_FSD", "IT"]), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
        createdBy: req.user?.id
      });
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/users/:id", requireAuth, requireRole(["Director_MPD", "Director_FHP", "Director_FSD", "IT"]), async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(parseInt(req.params.id), validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireRole(["IT"]), async (req, res) => {
    try {
      const success = await storage.deleteUser(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}