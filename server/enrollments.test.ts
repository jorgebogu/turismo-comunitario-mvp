import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  enrollInCourse: vi.fn(),
  getUserEnrollments: vi.fn(),
  getEnrollmentByCourseAndUser: vi.fn(),
  updateEnrollmentProgress: vi.fn(),
  dropEnrollment: vi.fn(),
  getUserEnrollmentStats: vi.fn(),
  getCourseEnrollmentCount: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-123",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("enrollments router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("enroll", () => {
    it("successfully enrolls a user in a course", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.enrollInCourse).mockResolvedValue({
        alreadyEnrolled: false,
        insertId: 1,
      });

      const result = await caller.enrollments.enroll({ courseId: 1 });

      expect(result.success).toBe(true);
      expect(result.alreadyEnrolled).toBe(false);
      expect(result.message).toBe("Inscripción exitosa");
      expect(db.enrollInCourse).toHaveBeenCalledWith({
        courseId: 1,
        userId: 1,
      });
    });

    it("returns already enrolled message when user is already enrolled", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.enrollInCourse).mockResolvedValue({
        alreadyEnrolled: true,
        enrollment: { id: 1, courseId: 1, userId: 1, status: "enrolled", progress: 0 },
      });

      const result = await caller.enrollments.enroll({ courseId: 1 });

      expect(result.success).toBe(true);
      expect(result.alreadyEnrolled).toBe(true);
      expect(result.message).toBe("Ya estás inscrito en este curso");
    });

    it("throws error when user is not authenticated", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.enrollments.enroll({ courseId: 1 })).rejects.toThrow();
    });
  });

  describe("myEnrollments", () => {
    it("returns user enrollments", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const mockEnrollments = [
        {
          enrollment: { id: 1, courseId: 1, userId: 1, status: "in_progress", progress: 50 },
          course: { id: 1, title: "Test Course", level: "basico" },
        },
      ];

      vi.mocked(db.getUserEnrollments).mockResolvedValue(mockEnrollments as any);

      const result = await caller.enrollments.myEnrollments();

      expect(result).toEqual(mockEnrollments);
      expect(db.getUserEnrollments).toHaveBeenCalledWith(1);
    });

    it("throws error when user is not authenticated", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.enrollments.myEnrollments()).rejects.toThrow();
    });
  });

  describe("checkEnrollment", () => {
    it("returns isEnrolled true when user is enrolled", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const mockEnrollment = { id: 1, courseId: 1, userId: 1, status: "enrolled", progress: 0 };
      vi.mocked(db.getEnrollmentByCourseAndUser).mockResolvedValue(mockEnrollment as any);

      const result = await caller.enrollments.checkEnrollment({ courseId: 1 });

      expect(result.isEnrolled).toBe(true);
      expect(result.enrollment).toEqual(mockEnrollment);
    });

    it("returns isEnrolled false when user is not enrolled", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.getEnrollmentByCourseAndUser).mockResolvedValue(null);

      const result = await caller.enrollments.checkEnrollment({ courseId: 1 });

      expect(result.isEnrolled).toBe(false);
      expect(result.enrollment).toBeNull();
    });
  });

  describe("updateProgress", () => {
    it("successfully updates enrollment progress", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const mockEnrollments = [
        {
          enrollment: { id: 1, courseId: 1, userId: 1, status: "in_progress", progress: 50 },
          course: { id: 1, title: "Test Course" },
        },
      ];

      vi.mocked(db.getUserEnrollments).mockResolvedValue(mockEnrollments as any);
      vi.mocked(db.updateEnrollmentProgress).mockResolvedValue(undefined);

      const result = await caller.enrollments.updateProgress({
        enrollmentId: 1,
        progress: 75,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Progreso actualizado");
      expect(db.updateEnrollmentProgress).toHaveBeenCalledWith(1, 75);
    });

    it("throws error when enrollment not found", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.getUserEnrollments).mockResolvedValue([]);

      await expect(
        caller.enrollments.updateProgress({ enrollmentId: 999, progress: 50 })
      ).rejects.toThrow("Inscripción no encontrada");
    });
  });

  describe("drop", () => {
    it("successfully drops a course enrollment", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.dropEnrollment).mockResolvedValue(true);

      const result = await caller.enrollments.drop({ enrollmentId: 1 });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Has abandonado el curso");
      expect(db.dropEnrollment).toHaveBeenCalledWith(1, 1);
    });
  });

  describe("myStats", () => {
    it("returns user enrollment statistics", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const mockStats = { total: 5, inProgress: 2, completed: 3, enrolled: 0 };
      vi.mocked(db.getUserEnrollmentStats).mockResolvedValue(mockStats);

      const result = await caller.enrollments.myStats();

      expect(result).toEqual(mockStats);
      expect(db.getUserEnrollmentStats).toHaveBeenCalledWith(1);
    });
  });

  describe("getCourseEnrollmentCount", () => {
    it("returns the count of enrollments for a course", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);

      vi.mocked(db.getCourseEnrollmentCount).mockResolvedValue(42);

      const result = await caller.enrollments.getCourseEnrollmentCount({ courseId: 1 });

      expect(result).toBe(42);
      expect(db.getCourseEnrollmentCount).toHaveBeenCalledWith(1);
    });
  });
});
