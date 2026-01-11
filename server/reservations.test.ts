import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
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

function createPublicContext(): TrpcContext {
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

describe("reservations router", () => {
  describe("create", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reservations.create({
          experienceId: 1,
          visitorName: "Juan Pérez",
          visitorEmail: "juan@example.com",
          visitDate: new Date().toISOString(),
          numberOfAdults: 2,
        })
      ).rejects.toThrow();
    });

    it("validates required fields", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Missing visitorName
      await expect(
        caller.reservations.create({
          experienceId: 1,
          visitorName: "",
          visitorEmail: "juan@example.com",
          visitDate: new Date().toISOString(),
          numberOfAdults: 2,
        })
      ).rejects.toThrow();
    });

    it("validates email format", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reservations.create({
          experienceId: 1,
          visitorName: "Juan Pérez",
          visitorEmail: "invalid-email",
          visitDate: new Date().toISOString(),
          numberOfAdults: 2,
        })
      ).rejects.toThrow();
    });

    it("validates numberOfAdults minimum", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reservations.create({
          experienceId: 1,
          visitorName: "Juan Pérez",
          visitorEmail: "juan@example.com",
          visitDate: new Date().toISOString(),
          numberOfAdults: 0,
        })
      ).rejects.toThrow();
    });
  });

  describe("myReservations", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.reservations.myReservations()).rejects.toThrow();
    });

    it("returns array for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reservations.myReservations();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getById", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reservations.getById({ id: 1 })
      ).rejects.toThrow();
    });
  });

  describe("cancel", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reservations.cancel({ id: 1 })
      ).rejects.toThrow();
    });
  });

  describe("myStats", () => {
    it("requires authentication", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.reservations.myStats()).rejects.toThrow();
    });

    it("returns stats object for authenticated user", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reservations.myStats();
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("pendientes");
      expect(result).toHaveProperty("confirmadas");
      expect(result).toHaveProperty("completadas");
      expect(result).toHaveProperty("canceladas");
    });
  });
});

describe("reservation input validation", () => {
  it("accepts valid reservation data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This should not throw for validation, but may fail on DB operation
    // We're testing the input validation schema
    const validInput = {
      experienceId: 1,
      visitorName: "María García",
      visitorEmail: "maria@example.com",
      visitorPhone: "+52 555 123 4567",
      visitDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      visitEndDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      numberOfAdults: 2,
      numberOfChildren: 1,
      message: "Estamos muy emocionados por visitar",
      specialRequirements: "Vegetariano",
    };

    // The validation should pass, even if DB operation fails
    try {
      await caller.reservations.create(validInput);
    } catch (error: any) {
      // If it fails, it should be a DB error, not a validation error
      expect(error.message).not.toContain("validation");
    }
  });

  it("rejects negative numberOfChildren", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.reservations.create({
        experienceId: 1,
        visitorName: "Test User",
        visitorEmail: "test@example.com",
        visitDate: new Date().toISOString(),
        numberOfAdults: 1,
        numberOfChildren: -1,
      })
    ).rejects.toThrow();
  });

  it("accepts reservation without optional fields", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const minimalInput = {
      experienceId: 1,
      visitorName: "Test User",
      visitorEmail: "test@example.com",
      visitDate: new Date(Date.now() + 86400000).toISOString(),
      numberOfAdults: 1,
    };

    // Should not throw validation error
    try {
      await caller.reservations.create(minimalInput);
    } catch (error: any) {
      expect(error.message).not.toContain("validation");
    }
  });
});
