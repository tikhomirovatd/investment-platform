import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for various types
export const userTypeEnum = pgEnum('user_type', ['SELLER', 'BUYER']);
export const dealTypeEnum = pgEnum('deal_type', ['SALE', 'INVESTMENT']);
export const requestStatusEnum = pgEnum('request_status', ['NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userType: userTypeEnum('user_type').notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  organizationName: text("organization_name").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  lastAccess: timestamp("last_access"),
  comments: text("comments"),
});

// Projects table
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dealType: dealTypeEnum('deal_type').notNull(),
  industry: text("industry").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
});

// Requests table
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  userType: userTypeEnum('user_type').notNull(),
  topic: text("topic").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: requestStatusEnum('status').default('NEW').notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  comments: text("comments"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, lastAccess: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;
