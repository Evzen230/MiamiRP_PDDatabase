import { 
  users, citizens, vehicles, driverLicenses, businesses, properties, permits, criminalRecords,
  type User, type InsertUser, type Citizen, type InsertCitizen,
  type Vehicle, type InsertVehicle, type DriverLicense, type InsertDriverLicense,
  type Business, type InsertBusiness, type Property, type InsertProperty,
  type Permit, type InsertPermit, type CriminalRecord, type InsertCriminalRecord
} from "@shared/schema";
import { db } from "./db";
import { eq, like, or, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Citizens management
  getCitizen(id: number): Promise<Citizen | undefined>;
  getCitizenByCitizenId(citizenId: string): Promise<Citizen | undefined>;
  createCitizen(citizen: InsertCitizen): Promise<Citizen>;
  updateCitizen(id: number, citizen: Partial<InsertCitizen>): Promise<Citizen | undefined>;
  deleteCitizen(id: number): Promise<boolean>;
  getAllCitizens(): Promise<Citizen[]>;
  searchCitizens(query: string): Promise<Citizen[]>;
  getWantedCitizens(): Promise<Citizen[]>;
  
  // Vehicles management
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  getAllVehicles(): Promise<Vehicle[]>;
  searchVehicles(query: string): Promise<Vehicle[]>;
  getVehiclesByOwner(ownerId: number): Promise<Vehicle[]>;
  
  // Driver licenses management
  getDriverLicense(id: number): Promise<DriverLicense | undefined>;
  getDriverLicenseByNumber(licenseNumber: string): Promise<DriverLicense | undefined>;
  createDriverLicense(license: InsertDriverLicense): Promise<DriverLicense>;
  updateDriverLicense(id: number, license: Partial<InsertDriverLicense>): Promise<DriverLicense | undefined>;
  deleteDriverLicense(id: number): Promise<boolean>;
  getDriverLicensesByCitizen(citizenId: number): Promise<DriverLicense[]>;
  
  // Businesses management
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  deleteBusiness(id: number): Promise<boolean>;
  getAllBusinesses(): Promise<Business[]>;
  searchBusinesses(query: string): Promise<Business[]>;
  getBusinessesByOwner(ownerId: number): Promise<Business[]>;
  
  // Properties management
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  getAllProperties(): Promise<Property[]>;
  searchProperties(query: string): Promise<Property[]>;
  getPropertiesByOwner(ownerId: number): Promise<Property[]>;
  
  // Permits management
  getPermit(id: number): Promise<Permit | undefined>;
  createPermit(permit: InsertPermit): Promise<Permit>;
  updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit | undefined>;
  deletePermit(id: number): Promise<boolean>;
  getAllPermits(): Promise<Permit[]>;
  getPermitsByCitizen(citizenId: number): Promise<Permit[]>;
  
  // Criminal records management
  getCriminalRecord(id: number): Promise<CriminalRecord | undefined>;
  createCriminalRecord(record: InsertCriminalRecord): Promise<CriminalRecord>;
  updateCriminalRecord(id: number, record: Partial<InsertCriminalRecord>): Promise<CriminalRecord | undefined>;  
  deleteCriminalRecord(id: number): Promise<boolean>;
  getAllCriminalRecords(): Promise<CriminalRecord[]>;
  getCriminalRecordsByCitizen(citizenId: number): Promise<CriminalRecord[]>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Citizens management
  async getCitizen(id: number): Promise<Citizen | undefined> {
    const [citizen] = await db.select().from(citizens).where(eq(citizens.id, id));
    return citizen || undefined;
  }

  async getCitizenByCitizenId(citizenId: string): Promise<Citizen | undefined> {
    const [citizen] = await db.select().from(citizens).where(eq(citizens.citizenId, citizenId));
    return citizen || undefined;
  }

  async createCitizen(insertCitizen: InsertCitizen): Promise<Citizen> {
    const [citizen] = await db.insert(citizens).values(insertCitizen).returning();
    return citizen;
  }

  async updateCitizen(id: number, updateData: Partial<InsertCitizen>): Promise<Citizen | undefined> {
    const [citizen] = await db.update(citizens).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(citizens.id, id)).returning();
    return citizen || undefined;
  }

  async deleteCitizen(id: number): Promise<boolean> {
    const result = await db.delete(citizens).where(eq(citizens.id, id));
    return result.rowCount > 0;
  }

  async getAllCitizens(): Promise<Citizen[]> {
    return await db.select().from(citizens).orderBy(desc(citizens.createdAt));
  }

  async searchCitizens(query: string): Promise<Citizen[]> {
    return await db.select().from(citizens).where(
      or(
        like(citizens.firstName, `%${query}%`),
        like(citizens.lastName, `%${query}%`),
        like(citizens.citizenId, `%${query}%`),
        like(citizens.phone, `%${query}%`),
        like(citizens.email, `%${query}%`)
      )
    ).orderBy(desc(citizens.createdAt));
  }

  async getWantedCitizens(): Promise<Citizen[]> {
    return await db.select().from(citizens).where(eq(citizens.isWanted, true));
  }

  // Vehicles management
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async getVehicleByLicensePlate(licensePlate: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.licensePlate, licensePlate));
    return vehicle || undefined;
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(insertVehicle).returning();
    return vehicle;
  }

  async updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [vehicle] = await db.update(vehicles).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(vehicles.id, id)).returning();
    return vehicle || undefined;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return result.rowCount > 0;
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async searchVehicles(query: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(
      or(
        like(vehicles.licensePlate, `%${query}%`),
        like(vehicles.make, `%${query}%`),
        like(vehicles.model, `%${query}%`),
        like(vehicles.color, `%${query}%`),
        like(vehicles.vin, `%${query}%`)
      )
    ).orderBy(desc(vehicles.createdAt));
  }

  async getVehiclesByOwner(ownerId: number): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.ownerId, ownerId));
  }

  // Driver licenses management
  async getDriverLicense(id: number): Promise<DriverLicense | undefined> {
    const [license] = await db.select().from(driverLicenses).where(eq(driverLicenses.id, id));
    return license || undefined;
  }

  async getDriverLicenseByNumber(licenseNumber: string): Promise<DriverLicense | undefined> {
    const [license] = await db.select().from(driverLicenses).where(eq(driverLicenses.licenseNumber, licenseNumber));
    return license || undefined;
  }

  async createDriverLicense(insertLicense: InsertDriverLicense): Promise<DriverLicense> {
    const [license] = await db.insert(driverLicenses).values(insertLicense).returning();
    return license;
  }

  async updateDriverLicense(id: number, updateData: Partial<InsertDriverLicense>): Promise<DriverLicense | undefined> {
    const [license] = await db.update(driverLicenses).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(driverLicenses.id, id)).returning();
    return license || undefined;
  }

  async deleteDriverLicense(id: number): Promise<boolean> {
    const result = await db.delete(driverLicenses).where(eq(driverLicenses.id, id));
    return result.rowCount > 0;
  }

  async getDriverLicensesByCitizen(citizenId: number): Promise<DriverLicense[]> {
    return await db.select().from(driverLicenses).where(eq(driverLicenses.citizenId, citizenId));
  }

  // Businesses management
  async getBusiness(id: number): Promise<Business | undefined> {
    const [business] = await db.select().from(businesses).where(eq(businesses.id, id));
    return business || undefined;
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const [business] = await db.insert(businesses).values(insertBusiness).returning();
    return business;
  }

  async updateBusiness(id: number, updateData: Partial<InsertBusiness>): Promise<Business | undefined> {
    const [business] = await db.update(businesses).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(businesses.id, id)).returning();
    return business || undefined;
  }

  async deleteBusiness(id: number): Promise<boolean> {
    const result = await db.delete(businesses).where(eq(businesses.id, id));
    return result.rowCount > 0;
  }

  async getAllBusinesses(): Promise<Business[]> {
    return await db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    return await db.select().from(businesses).where(
      or(
        like(businesses.businessName, `%${query}%`),
        like(businesses.businessLicense, `%${query}%`),
        like(businesses.businessType, `%${query}%`),
        like(businesses.address, `%${query}%`)
      )
    ).orderBy(desc(businesses.createdAt));
  }

  async getBusinessesByOwner(ownerId: number): Promise<Business[]> {
    return await db.select().from(businesses).where(eq(businesses.ownerId, ownerId));
  }

  // Properties management
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || undefined;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const [property] = await db.update(properties).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(properties.id, id)).returning();
    return property || undefined;
  }

  async deleteProperty(id: number): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount > 0;
  }

  async getAllProperties(): Promise<Property[]> {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async searchProperties(query: string): Promise<Property[]> {
    return await db.select().from(properties).where(
      or(
        like(properties.address, `%${query}%`),
        like(properties.propertyType, `%${query}%`)
      )
    ).orderBy(desc(properties.createdAt));
  }

  async getPropertiesByOwner(ownerId: number): Promise<Property[]> {
    return await db.select().from(properties).where(eq(properties.ownerId, ownerId));
  }

  // Permits management
  async getPermit(id: number): Promise<Permit | undefined> {
    const [permit] = await db.select().from(permits).where(eq(permits.id, id));
    return permit || undefined;
  }

  async createPermit(insertPermit: InsertPermit): Promise<Permit> {
    const [permit] = await db.insert(permits).values(insertPermit).returning();
    return permit;
  }

  async updatePermit(id: number, updateData: Partial<InsertPermit>): Promise<Permit | undefined> {
    const [permit] = await db.update(permits).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(permits.id, id)).returning();
    return permit || undefined;
  }

  async deletePermit(id: number): Promise<boolean> {
    const result = await db.delete(permits).where(eq(permits.id, id));
    return result.rowCount > 0;
  }

  async getAllPermits(): Promise<Permit[]> {
    return await db.select().from(permits).orderBy(desc(permits.createdAt));
  }

  async getPermitsByCitizen(citizenId: number): Promise<Permit[]> {
    return await db.select().from(permits).where(eq(permits.citizenId, citizenId));
  }

  // Criminal records management
  async getCriminalRecord(id: number): Promise<CriminalRecord | undefined> {
    const [record] = await db.select().from(criminalRecords).where(eq(criminalRecords.id, id));
    return record || undefined;
  }

  async createCriminalRecord(insertRecord: InsertCriminalRecord): Promise<CriminalRecord> {
    const [record] = await db.insert(criminalRecords).values(insertRecord).returning();
    return record;
  }

  async updateCriminalRecord(id: number, updateData: Partial<InsertCriminalRecord>): Promise<CriminalRecord | undefined> {
    const [record] = await db.update(criminalRecords).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(criminalRecords.id, id)).returning();
    return record || undefined;
  }

  async deleteCriminalRecord(id: number): Promise<boolean> {
    const result = await db.delete(criminalRecords).where(eq(criminalRecords.id, id));
    return result.rowCount > 0;
  }

  async getAllCriminalRecords(): Promise<CriminalRecord[]> {
    return await db.select().from(criminalRecords).orderBy(desc(criminalRecords.createdAt));
  }

  async getCriminalRecordsByCitizen(citizenId: number): Promise<CriminalRecord[]> {
    return await db.select().from(criminalRecords).where(eq(criminalRecords.citizenId, citizenId));
  }
}

export const storage = new DatabaseStorage();
