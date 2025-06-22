import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for authentication and role management
export const users: any = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // DMV, MPD, FHP, FSD, ICE, IRS, Director_MPD, Director_FHP, Director_FSD, IT
  department: text("department"), // MPD, FHP, FSD, DMV, ICE, IRS, IT
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").references((): any => users.id),
});

// Citizens table - core citizen information
export const citizens = pgTable("citizens", {
  id: serial("id").primaryKey(),
  citizenId: text("citizen_id").notNull().unique(), // MIA-123456
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  photoUrl: text("photo_url"),
  isWanted: boolean("is_wanted").notNull().default(false),
  wantedReason: text("wanted_reason"),
  isAmber: boolean("is_amber").notNull().default(false),
  isDeceased: boolean("is_deceased").notNull().default(false),
  immigrationStatus: text("immigration_status"), // citizen, immigrant, tourist
  taxFraudFlag: boolean("tax_fraud_flag").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  licensePlate: text("license_plate").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  type: text("type").notNull(), // sedan, suv, truck, motorcycle, etc.
  modifications: text("modifications"), // any modifications to the vehicle
  vin: text("vin").unique(),
  ownerId: integer("owner_id").references(() => citizens.id).notNull(),
  isRegistered: boolean("is_registered").notNull().default(true),
  registrationExpires: text("registration_expires"),
  isStolen: boolean("is_stolen").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Driver licenses
export const driverLicenses = pgTable("driver_licenses", {
  id: serial("id").primaryKey(),
  licenseNumber: text("license_number").notNull().unique(),
  citizenId: integer("citizen_id").references(() => citizens.id).notNull(),
  isValid: boolean("is_valid").notNull().default(true),
  expiresAt: text("expires_at"),
  restrictions: text("restrictions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Businesses
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  businessLicense: text("business_license").notNull().unique(),
  ownerId: integer("owner_id").references(() => citizens.id).notNull(),
  type: text("type").notNull(), // restaurant, retail, food truck, etc.
  address: text("address").notNull(), // address or license plate for food trucks
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Properties
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  ownerId: integer("owner_id").references(() => citizens.id).notNull(),
  type: text("type").notNull(), // house, apartment, commercial, warehouse
  isOwned: boolean("is_owned").notNull().default(true),
  marketValue: integer("market_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Permits and licenses
export const permits = pgTable("permits", {
  id: serial("id").primaryKey(),
  permitNumber: text("permit_number").notNull().unique(),
  permitType: text("permit_type").notNull(), // weapon, business, construction, etc.
  citizenId: integer("citizen_id").references(() => citizens.id).notNull(),
  isValid: boolean("is_valid").notNull().default(true),
  expiresAt: text("expires_at"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Criminal records
export const criminalRecords = pgTable("criminal_records", {
  id: serial("id").primaryKey(),
  citizenId: integer("citizen_id").references(() => citizens.id).notNull(),
  crimeType: text("crime_type").notNull(),
  description: text("description"),
  dateOfCrime: text("date_of_crime").notNull(),
  status: text("status").notNull(), // active, resolved, warrant
  fine: integer("fine"),
  isPaid: boolean("is_paid").notNull().default(false),
  jailTime: text("jail_time"),
  courtDate: text("court_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  updatedBy: integer("updated_by").references(() => users.id).notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  createdCitizens: many(citizens, { relationName: "citizenCreator" }),
  updatedCitizens: many(citizens, { relationName: "citizenUpdater" }),
  createdVehicles: many(vehicles, { relationName: "vehicleCreator" }),
  updatedVehicles: many(vehicles, { relationName: "vehicleUpdater" }),
  createdBy: one(users, { fields: [users.createdBy], references: [users.id] }),
}));

export const citizensRelations = relations(citizens, ({ many, one }) => ({
  vehicles: many(vehicles),
  driverLicenses: many(driverLicenses),
  businesses: many(businesses),
  properties: many(properties),
  permits: many(permits),
  criminalRecords: many(criminalRecords),
  createdBy: one(users, { fields: [citizens.createdBy], references: [users.id], relationName: "citizenCreator" }),
  updatedBy: one(users, { fields: [citizens.updatedBy], references: [users.id], relationName: "citizenUpdater" }),
}));

export const vehiclesRelations = relations(vehicles, ({ one }) => ({
  owner: one(citizens, { fields: [vehicles.ownerId], references: [citizens.id] }),
  createdBy: one(users, { fields: [vehicles.createdBy], references: [users.id], relationName: "vehicleCreator" }),
  updatedBy: one(users, { fields: [vehicles.updatedBy], references: [users.id], relationName: "vehicleUpdater" }),
}));

export const driverLicensesRelations = relations(driverLicenses, ({ one }) => ({
  citizen: one(citizens, { fields: [driverLicenses.citizenId], references: [citizens.id] }),
  createdBy: one(users, { fields: [driverLicenses.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [driverLicenses.updatedBy], references: [users.id] }),
}));

export const businessesRelations = relations(businesses, ({ one }) => ({
  owner: one(citizens, { fields: [businesses.ownerId], references: [citizens.id] }),
  createdBy: one(users, { fields: [businesses.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [businesses.updatedBy], references: [users.id] }),
}));

export const propertiesRelations = relations(properties, ({ one }) => ({
  owner: one(citizens, { fields: [properties.ownerId], references: [citizens.id] }),
  createdBy: one(users, { fields: [properties.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [properties.updatedBy], references: [users.id] }),
}));

export const permitsRelations = relations(permits, ({ one }) => ({
  citizen: one(citizens, { fields: [permits.citizenId], references: [citizens.id] }),
  createdBy: one(users, { fields: [permits.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [permits.updatedBy], references: [users.id] }),
}));

export const criminalRecordsRelations = relations(criminalRecords, ({ one }) => ({
  citizen: one(citizens, { fields: [criminalRecords.citizenId], references: [citizens.id] }),
  createdBy: one(users, { fields: [criminalRecords.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [criminalRecords.updatedBy], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCitizenSchema = createInsertSchema(citizens).omit({
  id: true,
  citizenId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDriverLicenseSchema = createInsertSchema(driverLicenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPermitSchema = createInsertSchema(permits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  issuedAt: true,
});

export const insertCriminalRecordSchema = createInsertSchema(criminalRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Citizen = typeof citizens.$inferSelect;
export type InsertCitizen = z.infer<typeof insertCitizenSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type DriverLicense = typeof driverLicenses.$inferSelect;
export type InsertDriverLicense = z.infer<typeof insertDriverLicenseSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Permit = typeof permits.$inferSelect;
export type InsertPermit = z.infer<typeof insertPermitSchema>;
export type CriminalRecord = typeof criminalRecords.$inferSelect;
export type InsertCriminalRecord = z.infer<typeof insertCriminalRecordSchema>;
