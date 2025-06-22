import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertCitizenSchema, insertVehicleSchema, insertDriverLicenseSchema,
  insertBusinessSchema, insertPropertySchema, insertPermitSchema,
  insertCriminalRecordSchema, insertUserSchema
} from "@shared/schema";

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireRole(allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Citizens routes
  app.get("/api/citizens", requireAuth, async (req, res) => {
    try {
      const { search } = req.query;
      const citizens = search 
        ? await storage.searchCitizens(search as string)
        : await storage.getAllCitizens();
      res.json(citizens);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch citizens" });
    }
  });

  app.get("/api/citizens/:id", requireAuth, async (req, res) => {
    try {
      const citizen = await storage.getCitizen(parseInt(req.params.id));
      if (!citizen) {
        return res.status(404).json({ message: "Citizen not found" });
      }
      res.json(citizen);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch citizen" });
    }
  });

  app.post("/api/citizens", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertCitizenSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
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
        updatedBy: req.user.id
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
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete citizen" });
    }
  });

  app.get("/api/citizens/:id/vehicles", requireAuth, async (req, res) => {
    try {
      const vehicles = await storage.getVehiclesByOwner(parseInt(req.params.id));
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/citizens/:id/criminal-records", requireAuth, async (req, res) => {
    try {
      const records = await storage.getCriminalRecordsByCitizen(parseInt(req.params.id));
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch criminal records" });
    }
  });

  // Vehicles routes
  app.get("/api/vehicles", requireAuth, async (req, res) => {
    try {
      const { search } = req.query;
      const vehicles = search 
        ? await storage.searchVehicles(search as string)
        : await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", requireAuth, async (req, res) => {
    try {
      const vehicle = await storage.getVehicle(parseInt(req.params.id));
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", requireAuth, requireRole(["DMV", "IT"]), async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
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
        updatedBy: req.user.id
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

  app.delete("/api/vehicles/:id", requireAuth, requireRole(["IT"]), async (req, res) => {
    try {
      const success = await storage.deleteVehicle(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vehicle" });
    }
  });

  // Businesses routes
  app.get("/api/businesses", requireAuth, async (req, res) => {
    try {
      const { search } = req.query;
      const businesses = search 
        ? await storage.searchBusinesses(search as string)
        : await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  app.post("/api/businesses", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      res.status(400).json({ message: "Invalid business data" });
    }
  });

  app.put("/api/businesses/:id", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.partial().parse({
        ...req.body,
        updatedBy: req.user.id
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
  app.get("/api/properties", requireAuth, async (req, res) => {
    try {
      const { search } = req.query;
      const properties = search 
        ? await storage.searchProperties(search as string)
        : await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post("/api/properties", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data" });
    }
  });

  // Criminal records routes
  app.get("/api/criminal-records", requireAuth, async (req, res) => {
    try {
      const records = await storage.getAllCriminalRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch criminal records" });
    }
  });

  app.post("/api/criminal-records", requireAuth, requireRole(["MPD", "FHP", "FSD", "Director_MPD", "Director_FHP", "Director_FSD", "IT"]), async (req, res) => {
    try {
      const validatedData = insertCriminalRecordSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      const record = await storage.createCriminalRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid criminal record data" });
    }
  });

  // Permits routes
  app.get("/api/permits", requireAuth, async (req, res) => {
    try {
      const permits = await storage.getAllPermits();
      res.json(permits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch permits" });
    }
  });

  app.post("/api/permits", requireAuth, async (req, res) => {
    try {
      const validatedData = insertPermitSchema.parse({
        ...req.body,
        createdBy: req.user.id,
        updatedBy: req.user.id
      });
      const permit = await storage.createPermit(validatedData);
      res.status(201).json(permit);
    } catch (error) {
      res.status(400).json({ message: "Invalid permit data" });
    }
  });

  // User management routes (IT and Directors only)
  app.get("/api/users", requireAuth, requireRole(["IT", "Director_MPD", "Director_FHP", "Director_FSD"]), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAuth, requireRole(["IT", "Director_MPD", "Director_FHP", "Director_FSD"]), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
        createdBy: req.user.id
      });
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.delete("/api/users/:id", requireAuth, requireRole(["IT", "Director_MPD", "Director_FHP", "Director_FSD"]), async (req, res) => {
    try {
      const success = await storage.deleteUser(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Wanted list routes
  app.get("/api/wanted", requireAuth, async (req, res) => {
    try {
      const wanted = await storage.getWantedCitizens();
      res.json(wanted);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wanted list" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
