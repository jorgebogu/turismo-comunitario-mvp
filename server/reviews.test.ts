import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
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
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("reviews router", () => {
  describe("getByExperience", () => {
    it("returns reviews for a given experience", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.getByExperience({ experienceId: 1 });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getStats", () => {
    it("returns stats for a given experience", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.getStats({ experienceId: 1 });

      expect(result).toHaveProperty("averageRating");
      expect(result).toHaveProperty("totalReviews");
      expect(result).toHaveProperty("ratingDistribution");
      expect(typeof result.averageRating).toBe("number");
      expect(typeof result.totalReviews).toBe("number");
    });
  });

  describe("markHelpful", () => {
    it("increments helpful count for a review", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // This should not throw even if review doesn't exist
      const result = await caller.reviews.markHelpful({ reviewId: 999999 });

      expect(result).toEqual({ success: true });
    });
  });

  describe("create", () => {
    it("requires authentication to create a review", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.create({
          experienceId: 1,
          rating: 5,
          title: "Great experience",
          comment: "Loved it!",
        })
      ).rejects.toThrow();
    });

    it("validates rating is between 1 and 5", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.create({
          experienceId: 1,
          rating: 0,
          title: "Invalid rating",
        })
      ).rejects.toThrow();

      await expect(
        caller.reviews.create({
          experienceId: 1,
          rating: 6,
          title: "Invalid rating",
        })
      ).rejects.toThrow();
    });
  });

  describe("getUserReview", () => {
    it("requires authentication to get user review", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.getUserReview({ experienceId: 1 })
      ).rejects.toThrow();
    });

    it("returns null if user has no review", async () => {
      const ctx = createAuthContext(99999);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.reviews.getUserReview({ experienceId: 1 });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("requires authentication to delete a review", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.reviews.delete({ reviewId: 1 })
      ).rejects.toThrow();
    });
  });
});
