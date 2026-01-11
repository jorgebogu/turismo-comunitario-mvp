import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Experiencias Turísticas Comunitarias (ETC)
 */
export const experiences = mysqlTable("experiences", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  state: varchar("state", { length: 100 }).notNull(),
  municipality: varchar("municipality", { length: 150 }),
  community: varchar("community", { length: 200 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  category: mysqlEnum("category", [
    "ecoturismo",
    "turismo_rural",
    "turismo_aventura",
    "turismo_cultural",
    "observacion_naturaleza",
    "gastronomia"
  ]).default("ecoturismo"),
  imageUrl: text("imageUrl"),
  galleryUrls: text("galleryUrls"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  socialMedia: text("socialMedia"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = typeof experiences.$inferInsert;

/**
 * Distintivos / Certificaciones para Prestadores de Servicios
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  level: mysqlEnum("level", ["semilla", "excelencia"]).default("semilla"),
  iconUrl: text("iconUrl"),
  requirements: text("requirements"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Relación entre Experiencias y Distintivos
 */
export const experienceBadges = mysqlTable("experience_badges", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  badgeId: int("badgeId").notNull(),
  awardedAt: timestamp("awardedAt").defaultNow().notNull(),
  validUntil: timestamp("validUntil"),
  status: mysqlEnum("status", ["pending", "approved", "expired"]).default("pending"),
});

export type ExperienceBadge = typeof experienceBadges.$inferSelect;
export type InsertExperienceBadge = typeof experienceBadges.$inferInsert;

/**
 * Recursos Educativos del Centro de Contenido
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", [
    "guia",
    "manual",
    "infografia",
    "video",
    "documento",
    "normativa"
  ]).default("documento"),
  category: varchar("category", { length: 100 }),
  fileUrl: text("fileUrl"),
  thumbnailUrl: text("thumbnailUrl"),
  author: varchar("author", { length: 200 }),
  isPublic: boolean("isPublic").default(true),
  downloadCount: int("downloadCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Solicitudes de Contacto
 */
export const contactRequests = mysqlTable("contact_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  organization: varchar("organization", { length: 255 }),
  state: varchar("state", { length: 100 }),
  message: text("message").notNull(),
  type: mysqlEnum("type", [
    "informacion_general",
    "registro_comunidad",
    "distintivo",
    "capacitacion",
    "otro"
  ]).default("informacion_general"),
  status: mysqlEnum("status", ["nuevo", "en_proceso", "resuelto"]).default("nuevo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertContactRequest = typeof contactRequests.$inferInsert;

/**
 * Cursos del Campus Virtual
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  category: varchar("category", { length: 100 }),
  duration: varchar("duration", { length: 50 }),
  level: mysqlEnum("level", ["basico", "intermedio", "avanzado"]).default("basico"),
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Reseñas y Calificaciones de Experiencias
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 estrellas
  title: varchar("title", { length: 200 }),
  comment: text("comment"),
  visitDate: timestamp("visitDate"),
  isVerified: boolean("isVerified").default(false),
  isApproved: boolean("isApproved").default(true),
  helpfulCount: int("helpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
