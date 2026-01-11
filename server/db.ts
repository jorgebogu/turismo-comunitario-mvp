import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  experiences, InsertExperience, Experience,
  badges, InsertBadge,
  experienceBadges, InsertExperienceBadge,
  resources, InsertResource,
  contactRequests, InsertContactRequest,
  courses, InsertCourse,
  reviews, InsertReview, Review,
  certificates, InsertCertificate, Certificate,
  reservations, InsertReservation, Reservation
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ EXPERIENCES FUNCTIONS ============
export async function getExperiences(options?: { 
  limit?: number; 
  state?: string; 
  category?: string;
  featured?: boolean;
  active?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(experiences);
  const conditions = [];

  if (options?.active !== false) {
    conditions.push(eq(experiences.isActive, true));
  }
  if (options?.featured) {
    conditions.push(eq(experiences.isFeatured, true));
  }
  if (options?.state) {
    conditions.push(eq(experiences.state, options.state));
  }
  if (options?.category) {
    conditions.push(eq(experiences.category, options.category as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const result = await query.orderBy(desc(experiences.createdAt)).limit(options?.limit || 100);
  return result;
}

export async function getExperienceById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createExperience(data: InsertExperience) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(experiences).values(data);
  return result;
}

export async function getExperienceStates() {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .selectDistinct({ state: experiences.state })
    .from(experiences)
    .where(eq(experiences.isActive, true));
  
  return result.map(r => r.state);
}

// ============ BADGES FUNCTIONS ============
export async function getBadges(options?: { active?: boolean }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(badges);
  
  if (options?.active !== false) {
    query = query.where(eq(badges.isActive, true)) as any;
  }

  return await query.orderBy(badges.name);
}

export async function getBadgeById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(badges).where(eq(badges.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createBadge(data: InsertBadge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(badges).values(data);
}

// ============ EXPERIENCE BADGES FUNCTIONS ============
export async function getExperienceBadges(experienceId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      badge: badges,
      awardedAt: experienceBadges.awardedAt,
      status: experienceBadges.status,
    })
    .from(experienceBadges)
    .innerJoin(badges, eq(experienceBadges.badgeId, badges.id))
    .where(eq(experienceBadges.experienceId, experienceId));
}

// ============ RESOURCES FUNCTIONS ============
export async function getResources(options?: { 
  limit?: number; 
  type?: string; 
  category?: string;
  isPublic?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(resources);
  const conditions = [];

  if (options?.isPublic !== false) {
    conditions.push(eq(resources.isPublic, true));
  }
  if (options?.type) {
    conditions.push(eq(resources.type, options.type as any));
  }
  if (options?.category) {
    conditions.push(eq(resources.category, options.category));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query.orderBy(desc(resources.createdAt)).limit(options?.limit || 50);
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createResource(data: InsertResource) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(resources).values(data);
}

export async function incrementResourceDownload(id: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(resources)
    .set({ downloadCount: sql`${resources.downloadCount} + 1` })
    .where(eq(resources.id, id));
}

// ============ CONTACT REQUESTS FUNCTIONS ============
export async function createContactRequest(data: InsertContactRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(contactRequests).values(data);
}

export async function getContactRequests(options?: { status?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(contactRequests);

  if (options?.status) {
    query = query.where(eq(contactRequests.status, options.status as any)) as any;
  }

  return await query.orderBy(desc(contactRequests.createdAt)).limit(options?.limit || 50);
}

export async function updateContactRequestStatus(id: number, status: "nuevo" | "en_proceso" | "resuelto") {
  const db = await getDb();
  if (!db) return;

  await db.update(contactRequests).set({ status }).where(eq(contactRequests.id, id));
}

// ============ COURSES FUNCTIONS ============
export async function getCourses(options?: { 
  limit?: number; 
  category?: string;
  level?: string;
  featured?: boolean;
  active?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(courses);
  const conditions = [];

  if (options?.active !== false) {
    conditions.push(eq(courses.isActive, true));
  }
  if (options?.featured) {
    conditions.push(eq(courses.isFeatured, true));
  }
  if (options?.category) {
    conditions.push(eq(courses.category, options.category));
  }
  if (options?.level) {
    conditions.push(eq(courses.level, options.level as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query.orderBy(desc(courses.createdAt)).limit(options?.limit || 50);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(courses).values(data);
}

// ============ REVIEWS FUNCTIONS ============
export async function getReviewsByExperience(experienceId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      review: reviews,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(and(
      eq(reviews.experienceId, experienceId),
      eq(reviews.isApproved, true)
    ))
    .orderBy(desc(reviews.createdAt));
}

export async function getReviewStats(experienceId: number) {
  const db = await getDb();
  if (!db) return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };

  const [stats] = await db
    .select({
      avgRating: sql<number>`AVG(${reviews.rating})`,
      totalReviews: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(and(
      eq(reviews.experienceId, experienceId),
      eq(reviews.isApproved, true)
    ));

  const distribution = await db
    .select({
      rating: reviews.rating,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(and(
      eq(reviews.experienceId, experienceId),
      eq(reviews.isApproved, true)
    ))
    .groupBy(reviews.rating);

  const ratingDistribution: Record<number, number> = {};
  distribution.forEach(d => {
    ratingDistribution[d.rating] = Number(d.count);
  });

  return {
    averageRating: Number(stats?.avgRating || 0),
    totalReviews: Number(stats?.totalReviews || 0),
    ratingDistribution,
  };
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already reviewed this experience
  const existing = await db
    .select()
    .from(reviews)
    .where(and(
      eq(reviews.experienceId, data.experienceId),
      eq(reviews.userId, data.userId)
    ))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Ya has dejado una reseña para esta experiencia");
  }

  return await db.insert(reviews).values(data);
}

export async function deleteReview(reviewId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Only allow deletion of own reviews
  const result = await db
    .delete(reviews)
    .where(and(
      eq(reviews.id, reviewId),
      eq(reviews.userId, userId)
    ));

  return result;
}

export async function getUserReviewForExperience(experienceId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(reviews)
    .where(and(
      eq(reviews.experienceId, experienceId),
      eq(reviews.userId, userId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function incrementReviewHelpful(reviewId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(reviews)
    .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
    .where(eq(reviews.id, reviewId));
}

// ============ RESERVATIONS FUNCTIONS ============
export async function createReservation(data: InsertReservation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(reservations).values(data);
}

export async function getReservationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, userId))
    .orderBy(desc(reservations.createdAt));
}

export async function getReservationsByExperience(experienceId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(reservations)
    .where(eq(reservations.experienceId, experienceId))
    .orderBy(desc(reservations.createdAt));
}

export async function getReservationById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(reservations)
    .where(eq(reservations.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateReservationStatus(
  id: number, 
  status: "pendiente" | "confirmada" | "cancelada" | "completada" | "rechazada",
  communityResponse?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (communityResponse !== undefined) {
    updateData.communityResponse = communityResponse;
    updateData.respondedAt = new Date();
  }

  return await db
    .update(reservations)
    .set(updateData)
    .where(eq(reservations.id, id));
}

export async function cancelReservation(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Only allow cancellation of own reservations that are pending
  return await db
    .update(reservations)
    .set({ status: "cancelada" })
    .where(and(
      eq(reservations.id, id),
      eq(reservations.userId, userId),
      eq(reservations.status, "pendiente")
    ));
}

export async function getReservationStats(userId?: number) {
  const db = await getDb();
  if (!db) return { total: 0, pendientes: 0, confirmadas: 0, completadas: 0, canceladas: 0 };

  let query = db.select({
    status: reservations.status,
    count: sql<number>`count(*)`
  }).from(reservations);

  if (userId) {
    query = query.where(eq(reservations.userId, userId)) as any;
  }

  const results = await query.groupBy(reservations.status);

  const stats = { total: 0, pendientes: 0, confirmadas: 0, completadas: 0, canceladas: 0 };
  results.forEach((r: any) => {
    const count = Number(r.count);
    stats.total += count;
    if (r.status === 'pendiente') stats.pendientes = count;
    if (r.status === 'confirmada') stats.confirmadas = count;
    if (r.status === 'completada') stats.completadas = count;
    if (r.status === 'cancelada' || r.status === 'rechazada') stats.canceladas += count;
  });

  return stats;
}

// ============ STATS FUNCTIONS ============
export async function getStats() {
  const db = await getDb();
  if (!db) return { experiences: 0, badges: 0, resources: 0, courses: 0 };

  const [expCount] = await db.select({ count: sql<number>`count(*)` }).from(experiences).where(eq(experiences.isActive, true));
  const [badgeCount] = await db.select({ count: sql<number>`count(*)` }).from(badges).where(eq(badges.isActive, true));
  const [resCount] = await db.select({ count: sql<number>`count(*)` }).from(resources).where(eq(resources.isPublic, true));
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses).where(eq(courses.isActive, true));

  return {
    experiences: Number(expCount?.count || 0),
    badges: Number(badgeCount?.count || 0),
    resources: Number(resCount?.count || 0),
    courses: Number(courseCount?.count || 0),
  };
}

// ============ SEED FUNCTIONS ============
export async function seedDatabase() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot seed: database not available");
    return;
  }

  // Import seed data
  const { sampleExperiences, sampleResources, sampleCourses, sampleBadges } = await import("./seed-data");

  // Check if already seeded
  const existingExperiences = await db.select().from(experiences).limit(1);
  if (existingExperiences.length > 0) {
    console.log("[Database] Database already seeded, skipping...");
    return;
  }

  console.log("[Database] Seeding database with sample data...");

  // Seed experiences
  for (const exp of sampleExperiences) {
    await db.insert(experiences).values(exp);
  }
  console.log(`[Database] Seeded ${sampleExperiences.length} experiences`);

  // Seed resources
  for (const res of sampleResources) {
    await db.insert(resources).values(res);
  }
  console.log(`[Database] Seeded ${sampleResources.length} resources`);

  // Seed courses
  for (const course of sampleCourses) {
    await db.insert(courses).values(course);
  }
  console.log(`[Database] Seeded ${sampleCourses.length} courses`);

  // Seed badges
  for (const badge of sampleBadges) {
    await db.insert(badges).values(badge);
  }
  console.log(`[Database] Seeded ${sampleBadges.length} badges`);

  console.log("[Database] Seeding complete!");
}


// ============ COURSE ENROLLMENTS FUNCTIONS ============
import { courseEnrollments, InsertCourseEnrollment, CourseEnrollment } from "../drizzle/schema";

export async function enrollInCourse(data: InsertCourseEnrollment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already enrolled
  const existing = await db
    .select()
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.courseId, data.courseId),
      eq(courseEnrollments.userId, data.userId)
    ))
    .limit(1);

  if (existing.length > 0) {
    return { alreadyEnrolled: true, enrollment: existing[0] };
  }

  const result = await db.insert(courseEnrollments).values({
    ...data,
    startedAt: new Date(),
    lastAccessedAt: new Date(),
  });

  return { alreadyEnrolled: false, insertId: result[0].insertId };
}

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      enrollment: courseEnrollments,
      course: courses,
    })
    .from(courseEnrollments)
    .innerJoin(courses, eq(courseEnrollments.courseId, courses.id))
    .where(eq(courseEnrollments.userId, userId))
    .orderBy(desc(courseEnrollments.lastAccessedAt));
}

export async function getEnrollmentByCourseAndUser(courseId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.courseId, courseId),
      eq(courseEnrollments.userId, userId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateEnrollmentProgress(enrollmentId: number, progress: number) {
  const db = await getDb();
  if (!db) return;

  const updateData: Partial<CourseEnrollment> = {
    progress,
    lastAccessedAt: new Date(),
    status: progress >= 100 ? "completed" : "in_progress",
  };

  if (progress >= 100) {
    updateData.completedAt = new Date();
  }

  await db
    .update(courseEnrollments)
    .set(updateData)
    .where(eq(courseEnrollments.id, enrollmentId));
}

export async function dropEnrollment(enrollmentId: number, userId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .update(courseEnrollments)
    .set({ status: "dropped" })
    .where(and(
      eq(courseEnrollments.id, enrollmentId),
      eq(courseEnrollments.userId, userId)
    ));

  return true;
}

export async function getCourseEnrollmentCount(courseId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(courseEnrollments)
    .where(and(
      eq(courseEnrollments.courseId, courseId),
      sql`${courseEnrollments.status} != 'dropped'`
    ));

  return result[0]?.count || 0;
}

export async function getUserEnrollmentStats(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, inProgress: 0, completed: 0 };

  const result = await db
    .select({
      status: courseEnrollments.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(courseEnrollments)
    .where(eq(courseEnrollments.userId, userId))
    .groupBy(courseEnrollments.status);

  const stats = { total: 0, inProgress: 0, completed: 0, enrolled: 0 };
  result.forEach(r => {
    stats.total += Number(r.count);
    if (r.status === "completed") stats.completed = Number(r.count);
    if (r.status === "in_progress") stats.inProgress = Number(r.count);
    if (r.status === "enrolled") stats.enrolled = Number(r.count);
  });

  return stats;
}

// ============ CERTIFICATE FUNCTIONS ============

export async function createCertificate(data: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(certificates).values(data);
  return { insertId: Number(result[0].insertId) };
}

export async function getCertificateByEnrollment(enrollmentId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.enrollmentId, enrollmentId))
    .limit(1);

  return result[0] || null;
}

export async function getCertificateByCode(code: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateCode, code))
    .limit(1);

  return result[0] || null;
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      certificate: certificates,
      course: courses,
    })
    .from(certificates)
    .leftJoin(courses, eq(certificates.courseId, courses.id))
    .where(and(
      eq(certificates.userId, userId),
      eq(certificates.isValid, true)
    ))
    .orderBy(desc(certificates.issuedAt));

  return result;
}

export async function updateCertificatePdfUrl(certificateId: number, pdfUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(certificates)
    .set({ pdfUrl })
    .where(eq(certificates.id, certificateId));
}

export async function invalidateCertificate(certificateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(certificates)
    .set({ isValid: false })
    .where(eq(certificates.id, certificateId));
}
