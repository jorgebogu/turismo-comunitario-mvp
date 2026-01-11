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

/**
 * Inscripciones a Cursos del Campus Virtual
 */
export const courseEnrollments = mysqlTable("course_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["enrolled", "in_progress", "completed", "dropped"]).default("enrolled"),
  progress: int("progress").default(0), // Porcentaje de progreso 0-100
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  certificateUrl: text("certificateUrl"),
  lastAccessedAt: timestamp("lastAccessedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

/**
 * Certificados de Cursos Completados
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  enrollmentId: int("enrollmentId").notNull(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  certificateCode: varchar("certificateCode", { length: 50 }).notNull().unique(),
  userName: varchar("userName", { length: 255 }).notNull(),
  courseTitle: varchar("courseTitle", { length: 255 }).notNull(),
  courseLevel: varchar("courseLevel", { length: 50 }),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  pdfUrl: text("pdfUrl"),
  isValid: boolean("isValid").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Reservaciones / Solicitudes de Visita
 */
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  userId: int("userId").notNull(),
  
  // Información del visitante
  visitorName: varchar("visitorName", { length: 255 }).notNull(),
  visitorEmail: varchar("visitorEmail", { length: 320 }).notNull(),
  visitorPhone: varchar("visitorPhone", { length: 20 }),
  
  // Detalles de la reserva
  visitDate: timestamp("visitDate").notNull(),
  visitEndDate: timestamp("visitEndDate"),
  numberOfAdults: int("numberOfAdults").default(1).notNull(),
  numberOfChildren: int("numberOfChildren").default(0),
  
  // Mensaje y preferencias
  message: text("message"),
  specialRequirements: text("specialRequirements"),
  
  // Estado de la reservación
  status: mysqlEnum("status", [
    "pendiente",
    "confirmada", 
    "cancelada",
    "completada",
    "rechazada"
  ]).default("pendiente").notNull(),
  
  // Respuesta de la comunidad
  communityResponse: text("communityResponse"),
  respondedAt: timestamp("respondedAt"),
  
  // Metadatos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

/**
 * Disponibilidad de Experiencias
 * Define los días y horarios disponibles para cada experiencia
 */
export const availability = mysqlTable("availability", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  
  // Fecha específica de disponibilidad
  date: timestamp("date").notNull(),
  
  // Capacidad para ese día
  maxCapacity: int("maxCapacity").default(20).notNull(),
  currentBookings: int("currentBookings").default(0).notNull(),
  
  // Estado del día
  isAvailable: boolean("isAvailable").default(true).notNull(),
  
  // Precio especial para ese día (opcional)
  specialPrice: decimal("specialPrice", { precision: 10, scale: 2 }),
  
  // Notas adicionales
  notes: text("notes"),
  
  // Metadatos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = typeof availability.$inferInsert;

/**
 * Configuración de Disponibilidad por Defecto
 * Define los días de la semana disponibles por defecto para cada experiencia
 */
export const availabilityConfig = mysqlTable("availability_config", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  
  // Días de la semana disponibles (0=Domingo, 1=Lunes, ..., 6=Sábado)
  dayOfWeek: int("dayOfWeek").notNull(),
  
  // Capacidad por defecto para ese día
  defaultCapacity: int("defaultCapacity").default(20).notNull(),
  
  // Si está habilitado ese día
  isEnabled: boolean("isEnabled").default(true).notNull(),
  
  // Metadatos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AvailabilityConfig = typeof availabilityConfig.$inferSelect;
export type InsertAvailabilityConfig = typeof availabilityConfig.$inferInsert;

/**
 * Fechas Bloqueadas
 * Días específicos que no están disponibles (feriados, mantenimiento, etc.)
 */
export const blockedDates = mysqlTable("blocked_dates", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  
  // Fecha bloqueada
  date: timestamp("date").notNull(),
  
  // Razón del bloqueo
  reason: varchar("reason", { length: 255 }),
  
  // Metadatos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BlockedDate = typeof blockedDates.$inferSelect;
export type InsertBlockedDate = typeof blockedDates.$inferInsert;

/**
 * Imágenes de Experiencias
 * Galería de fotos para cada experiencia turística
 */
export const experienceImages = mysqlTable("experience_images", {
  id: int("id").autoincrement().primaryKey(),
  experienceId: int("experienceId").notNull(),
  
  // URL de la imagen
  imageUrl: text("imageUrl").notNull(),
  
  // Información de la imagen
  title: varchar("title", { length: 255 }),
  description: text("description"),
  altText: varchar("altText", { length: 255 }),
  
  // Orden de visualización (menor número = primero)
  displayOrder: int("displayOrder").default(0).notNull(),
  
  // Si es la imagen principal
  isPrimary: boolean("isPrimary").default(false).notNull(),
  
  // Metadatos
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExperienceImage = typeof experienceImages.$inferSelect;
export type InsertExperienceImage = typeof experienceImages.$inferInsert;
