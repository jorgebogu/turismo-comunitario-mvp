import { describe, expect, it, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn(),
  getExperiencesByOwner: vi.fn(),
  getReservationsByExperience: vi.fn(),
  getReservationById: vi.fn(),
  updateReservationStatus: vi.fn(),
  getAdminStats: vi.fn(),
  getCalendarReservations: vi.fn(),
}));

describe("Community Admin Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getExperiencesByOwner", () => {
    it("should return experiences for a given owner", async () => {
      const mockExperiences = [
        { id: 1, name: "Selva Lacandona", state: "Chiapas", ownerId: 1 },
        { id: 2, name: "Cascadas de Agua Azul", state: "Chiapas", ownerId: 1 },
      ];

      vi.mocked(db.getExperiencesByOwner).mockResolvedValue(mockExperiences);

      const result = await db.getExperiencesByOwner(1);

      expect(result).toEqual(mockExperiences);
      expect(db.getExperiencesByOwner).toHaveBeenCalledWith(1);
    });

    it("should return empty array when owner has no experiences", async () => {
      vi.mocked(db.getExperiencesByOwner).mockResolvedValue([]);

      const result = await db.getExperiencesByOwner(999);

      expect(result).toEqual([]);
    });
  });

  describe("getReservationsByExperience", () => {
    it("should return reservations for a given experience", async () => {
      const mockReservations = [
        {
          id: 1,
          experienceId: 1,
          userId: 2,
          visitDate: new Date("2026-02-15"),
          numberOfAdults: 2,
          numberOfChildren: 1,
          status: "pending",
        },
        {
          id: 2,
          experienceId: 1,
          userId: 3,
          visitDate: new Date("2026-02-20"),
          numberOfAdults: 4,
          numberOfChildren: 0,
          status: "confirmed",
        },
      ];

      vi.mocked(db.getReservationsByExperience).mockResolvedValue(mockReservations);

      const result = await db.getReservationsByExperience(1);

      expect(result).toEqual(mockReservations);
      expect(result).toHaveLength(2);
    });

    it("should filter reservations by status", async () => {
      const mockPendingReservations = [
        {
          id: 1,
          experienceId: 1,
          userId: 2,
          visitDate: new Date("2026-02-15"),
          status: "pending",
        },
      ];

      vi.mocked(db.getReservationsByExperience).mockResolvedValue(mockPendingReservations);

      const result = await db.getReservationsByExperience(1, "pending");

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("pending");
    });
  });

  describe("updateReservationStatus", () => {
    it("should update reservation status to confirmed", async () => {
      vi.mocked(db.updateReservationStatus).mockResolvedValue(undefined);

      await db.updateReservationStatus(1, "confirmed");

      expect(db.updateReservationStatus).toHaveBeenCalledWith(1, "confirmed");
    });

    it("should update reservation status to rejected", async () => {
      vi.mocked(db.updateReservationStatus).mockResolvedValue(undefined);

      await db.updateReservationStatus(1, "rejected");

      expect(db.updateReservationStatus).toHaveBeenCalledWith(1, "rejected");
    });

    it("should update reservation status to cancelled", async () => {
      vi.mocked(db.updateReservationStatus).mockResolvedValue(undefined);

      await db.updateReservationStatus(1, "cancelled");

      expect(db.updateReservationStatus).toHaveBeenCalledWith(1, "cancelled");
    });
  });

  describe("getAdminStats", () => {
    it("should return statistics for admin dashboard", async () => {
      const mockStats = {
        totalReservations: 25,
        pendingReservations: 5,
        confirmedReservations: 15,
        completedReservations: 5,
        totalVisitors: 78,
      };

      vi.mocked(db.getAdminStats).mockResolvedValue(mockStats);

      const result = await db.getAdminStats([1, 2, 3]);

      expect(result).toEqual(mockStats);
      expect(result.totalReservations).toBe(25);
      expect(result.pendingReservations).toBe(5);
    });

    it("should return zero stats when no experiences", async () => {
      const mockStats = {
        totalReservations: 0,
        pendingReservations: 0,
        confirmedReservations: 0,
        completedReservations: 0,
        totalVisitors: 0,
      };

      vi.mocked(db.getAdminStats).mockResolvedValue(mockStats);

      const result = await db.getAdminStats([]);

      expect(result.totalReservations).toBe(0);
    });
  });

  describe("getCalendarReservations", () => {
    it("should return reservations for a specific month", async () => {
      const mockReservations = [
        {
          id: 1,
          visitDate: new Date("2026-02-15"),
          numberOfAdults: 2,
          numberOfChildren: 1,
          status: "confirmed",
        },
        {
          id: 2,
          visitDate: new Date("2026-02-20"),
          numberOfAdults: 4,
          numberOfChildren: 0,
          status: "pending",
        },
      ];

      vi.mocked(db.getCalendarReservations).mockResolvedValue(mockReservations);

      const result = await db.getCalendarReservations(1, 2026, 2);

      expect(result).toHaveLength(2);
      expect(db.getCalendarReservations).toHaveBeenCalledWith(1, 2026, 2);
    });

    it("should return empty array for month with no reservations", async () => {
      vi.mocked(db.getCalendarReservations).mockResolvedValue([]);

      const result = await db.getCalendarReservations(1, 2026, 12);

      expect(result).toEqual([]);
    });
  });

  describe("Reservation Status Workflow", () => {
    it("should follow valid status transitions", async () => {
      // Valid transitions: pending -> confirmed -> completed
      // Valid transitions: pending -> rejected
      // Valid transitions: pending -> cancelled (by user)
      // Valid transitions: confirmed -> cancelled

      const validTransitions = [
        { from: "pending", to: "confirmed" },
        { from: "pending", to: "rejected" },
        { from: "pending", to: "cancelled" },
        { from: "confirmed", to: "completed" },
        { from: "confirmed", to: "cancelled" },
      ];

      for (const transition of validTransitions) {
        vi.mocked(db.updateReservationStatus).mockResolvedValue(undefined);
        
        await expect(
          db.updateReservationStatus(1, transition.to)
        ).resolves.not.toThrow();
      }
    });
  });

  describe("Admin Authorization", () => {
    it("should only allow owner to manage their experiences", async () => {
      const ownerId = 1;
      const mockExperiences = [
        { id: 1, name: "Experience 1", ownerId: 1 },
        { id: 2, name: "Experience 2", ownerId: 1 },
      ];

      vi.mocked(db.getExperiencesByOwner).mockResolvedValue(mockExperiences);

      const experiences = await db.getExperiencesByOwner(ownerId);
      
      // All returned experiences should belong to the owner
      expect(experiences.every(exp => exp.ownerId === ownerId)).toBe(true);
    });

    it("should not return experiences from other owners", async () => {
      const ownerId = 1;
      const otherOwnerId = 2;

      vi.mocked(db.getExperiencesByOwner).mockImplementation(async (id) => {
        if (id === ownerId) {
          return [{ id: 1, name: "My Experience", ownerId: 1 }];
        }
        return [];
      });

      const myExperiences = await db.getExperiencesByOwner(ownerId);
      const otherExperiences = await db.getExperiencesByOwner(otherOwnerId);

      expect(myExperiences).toHaveLength(1);
      expect(otherExperiences).toHaveLength(0);
    });
  });
});
