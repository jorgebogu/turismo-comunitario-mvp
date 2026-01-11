import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db functions
vi.mock("./db", () => ({
  getCalendarData: vi.fn(),
  checkAvailability: vi.fn(),
  getAvailabilityConfig: vi.fn(),
  setAvailabilityConfig: vi.fn(),
  initializeDefaultAvailability: vi.fn(),
  blockDate: vi.fn(),
  unblockDate: vi.fn(),
  getBlockedDates: vi.fn(),
  createOrUpdateAvailability: vi.fn(),
}));

import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(authenticated = false): TrpcContext {
  const user: AuthenticatedUser | null = authenticated
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

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

describe("availability router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCalendar", () => {
    it("returns calendar data for a month", async () => {
      const mockCalendarData = {
        experienceId: 1,
        year: 2026,
        month: 1,
        days: [
          {
            date: "2026-01-15",
            dayOfMonth: 15,
            dayOfWeek: 4,
            isAvailable: true,
            maxCapacity: 20,
            currentBookings: 5,
            remainingCapacity: 15,
            isBlocked: false,
            isPast: false,
            specialPrice: null,
            notes: null,
          },
        ],
      };

      vi.mocked(db.getCalendarData).mockResolvedValue(mockCalendarData);

      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.getCalendar({
        experienceId: 1,
        year: 2026,
        month: 1,
      });

      expect(result).toEqual(mockCalendarData);
      expect(db.getCalendarData).toHaveBeenCalledWith(1, 2026, 1);
    });
  });

  describe("checkDate", () => {
    it("returns availability for a specific date", async () => {
      const mockAvailability = {
        available: true,
        reason: null,
        remainingCapacity: 15,
        maxCapacity: 20,
        currentBookings: 5,
      };

      vi.mocked(db.checkAvailability).mockResolvedValue(mockAvailability);

      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.checkDate({
        experienceId: 1,
        date: "2026-01-15",
        requestedCapacity: 4,
      });

      expect(result).toEqual(mockAvailability);
      expect(db.checkAvailability).toHaveBeenCalledWith(1, expect.any(Date), 4);
    });

    it("returns unavailable when capacity exceeded", async () => {
      const mockAvailability = {
        available: false,
        reason: "No hay suficiente capacidad disponible",
        remainingCapacity: 2,
        maxCapacity: 20,
        currentBookings: 18,
      };

      vi.mocked(db.checkAvailability).mockResolvedValue(mockAvailability);

      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.checkDate({
        experienceId: 1,
        date: "2026-01-15",
        requestedCapacity: 5,
      });

      expect(result.available).toBe(false);
      expect(result.reason).toBeTruthy();
    });
  });

  describe("getConfig", () => {
    it("returns availability configuration for an experience", async () => {
      const mockConfig = [
        { dayOfWeek: 0, defaultCapacity: 0, isEnabled: false },
        { dayOfWeek: 1, defaultCapacity: 20, isEnabled: true },
        { dayOfWeek: 2, defaultCapacity: 20, isEnabled: true },
        { dayOfWeek: 3, defaultCapacity: 20, isEnabled: true },
        { dayOfWeek: 4, defaultCapacity: 20, isEnabled: true },
        { dayOfWeek: 5, defaultCapacity: 20, isEnabled: true },
        { dayOfWeek: 6, defaultCapacity: 15, isEnabled: true },
      ];

      vi.mocked(db.getAvailabilityConfig).mockResolvedValue(mockConfig);

      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.getConfig({
        experienceId: 1,
      });

      expect(result).toEqual(mockConfig);
      expect(db.getAvailabilityConfig).toHaveBeenCalledWith(1);
    });
  });

  describe("setConfig (protected)", () => {
    it("allows authenticated users to set availability config", async () => {
      vi.mocked(db.setAvailabilityConfig).mockResolvedValue(undefined);

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.setConfig({
        experienceId: 1,
        dayOfWeek: 1,
        defaultCapacity: 25,
        isEnabled: true,
      });

      expect(result.success).toBe(true);
      expect(db.setAvailabilityConfig).toHaveBeenCalledWith({
        experienceId: 1,
        dayOfWeek: 1,
        defaultCapacity: 25,
        isEnabled: true,
      });
    });

    it("rejects unauthenticated users", async () => {
      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.availability.setConfig({
          experienceId: 1,
          dayOfWeek: 1,
          defaultCapacity: 25,
          isEnabled: true,
        })
      ).rejects.toThrow();
    });
  });

  describe("blockDate (protected)", () => {
    it("allows blocking a date", async () => {
      vi.mocked(db.blockDate).mockResolvedValue({ alreadyBlocked: false });

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.blockDate({
        experienceId: 1,
        date: "2026-01-20",
        reason: "Mantenimiento",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("bloqueada");
    });

    it("handles already blocked dates", async () => {
      vi.mocked(db.blockDate).mockResolvedValue({ alreadyBlocked: true });

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.blockDate({
        experienceId: 1,
        date: "2026-01-20",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("ya estaba bloqueada");
    });
  });

  describe("unblockDate (protected)", () => {
    it("allows unblocking a date", async () => {
      vi.mocked(db.unblockDate).mockResolvedValue(undefined);

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.unblockDate({
        experienceId: 1,
        date: "2026-01-20",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("desbloqueada");
    });
  });

  describe("getBlockedDates", () => {
    it("returns blocked dates for a date range", async () => {
      const mockBlockedDates = [
        { date: new Date("2026-01-20"), reason: "Mantenimiento" },
        { date: new Date("2026-01-25"), reason: "Evento privado" },
      ];

      vi.mocked(db.getBlockedDates).mockResolvedValue(mockBlockedDates);

      const ctx = createMockContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.getBlockedDates({
        experienceId: 1,
        startDate: "2026-01-01",
        endDate: "2026-01-31",
      });

      expect(result).toEqual(mockBlockedDates);
    });
  });

  describe("initializeDefault (protected)", () => {
    it("initializes default availability for an experience", async () => {
      vi.mocked(db.initializeDefaultAvailability).mockResolvedValue(undefined);

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.initializeDefault({
        experienceId: 1,
        defaultCapacity: 30,
      });

      expect(result.success).toBe(true);
      expect(db.initializeDefaultAvailability).toHaveBeenCalledWith(1, 30);
    });
  });

  describe("setDateAvailability (protected)", () => {
    it("sets availability for a specific date", async () => {
      vi.mocked(db.createOrUpdateAvailability).mockResolvedValue(undefined);

      const ctx = createMockContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.availability.setDateAvailability({
        experienceId: 1,
        date: "2026-01-15",
        maxCapacity: 50,
        isAvailable: true,
        specialPrice: 500,
        notes: "Día especial",
      });

      expect(result.success).toBe(true);
      expect(db.createOrUpdateAvailability).toHaveBeenCalledWith({
        experienceId: 1,
        date: expect.any(Date),
        maxCapacity: 50,
        isAvailable: true,
        specialPrice: "500",
        notes: "Día especial",
      });
    });
  });
});
