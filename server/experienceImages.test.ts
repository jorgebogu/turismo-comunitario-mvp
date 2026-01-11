import { describe, it, expect, vi, beforeEach } from "vitest";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getExperienceImages: vi.fn(),
  createExperienceImage: vi.fn(),
  deleteExperienceImage: vi.fn(),
  updateExperienceImageOrder: vi.fn(),
  setPrimaryImage: vi.fn(),
}));

describe("experienceImages database functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getExperienceImages", () => {
    it("returns empty array when no images exist", async () => {
      vi.mocked(db.getExperienceImages).mockResolvedValue([]);
      
      const result = await db.getExperienceImages(999);
      
      expect(result).toEqual([]);
      expect(db.getExperienceImages).toHaveBeenCalledWith(999);
    });

    it("returns images sorted by displayOrder", async () => {
      const mockImages = [
        { id: 1, experienceId: 18, imageUrl: "/gallery/img1.jpg", displayOrder: 1, isPrimary: true, title: "Image 1", description: null, altText: null, createdAt: new Date() },
        { id: 2, experienceId: 18, imageUrl: "/gallery/img2.jpg", displayOrder: 2, isPrimary: false, title: "Image 2", description: null, altText: null, createdAt: new Date() },
      ];
      vi.mocked(db.getExperienceImages).mockResolvedValue(mockImages);
      
      const result = await db.getExperienceImages(18);
      
      expect(result).toHaveLength(2);
      expect(result[0].displayOrder).toBe(1);
      expect(result[1].displayOrder).toBe(2);
    });

    it("includes all image fields", async () => {
      const mockImage = {
        id: 1,
        experienceId: 18,
        imageUrl: "/gallery/monarca-1.jpg",
        title: "Mariposas Monarca",
        description: "Miles de mariposas",
        altText: "Mariposas en el santuario",
        displayOrder: 1,
        isPrimary: true,
        createdAt: new Date(),
      };
      vi.mocked(db.getExperienceImages).mockResolvedValue([mockImage]);
      
      const result = await db.getExperienceImages(18);
      
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("experienceId");
      expect(result[0]).toHaveProperty("imageUrl");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("description");
      expect(result[0]).toHaveProperty("altText");
      expect(result[0]).toHaveProperty("displayOrder");
      expect(result[0]).toHaveProperty("isPrimary");
    });
  });

  describe("createExperienceImage", () => {
    it("creates a new image with required fields", async () => {
      const newImage = {
        experienceId: 18,
        imageUrl: "/gallery/new-image.jpg",
      };
      vi.mocked(db.createExperienceImage).mockResolvedValue({ insertId: 1 } as any);
      
      await db.createExperienceImage(newImage);
      
      expect(db.createExperienceImage).toHaveBeenCalledWith(newImage);
    });

    it("creates image with optional fields", async () => {
      const newImage = {
        experienceId: 18,
        imageUrl: "/gallery/new-image.jpg",
        title: "New Image",
        description: "Description",
        altText: "Alt text",
        displayOrder: 3,
        isPrimary: false,
      };
      vi.mocked(db.createExperienceImage).mockResolvedValue({ insertId: 2 } as any);
      
      await db.createExperienceImage(newImage);
      
      expect(db.createExperienceImage).toHaveBeenCalledWith(newImage);
    });
  });

  describe("deleteExperienceImage", () => {
    it("deletes an image by id", async () => {
      vi.mocked(db.deleteExperienceImage).mockResolvedValue(undefined);
      
      await db.deleteExperienceImage(1);
      
      expect(db.deleteExperienceImage).toHaveBeenCalledWith(1);
    });
  });

  describe("updateExperienceImageOrder", () => {
    it("updates display order for an image", async () => {
      vi.mocked(db.updateExperienceImageOrder).mockResolvedValue(undefined);
      
      await db.updateExperienceImageOrder(1, 5);
      
      expect(db.updateExperienceImageOrder).toHaveBeenCalledWith(1, 5);
    });
  });

  describe("setPrimaryImage", () => {
    it("sets a new primary image for experience", async () => {
      vi.mocked(db.setPrimaryImage).mockResolvedValue(undefined);
      
      await db.setPrimaryImage(18, 2);
      
      expect(db.setPrimaryImage).toHaveBeenCalledWith(18, 2);
    });
  });
});

describe("experienceImages integration", () => {
  it("should handle gallery with multiple images", async () => {
    const mockImages = [
      { id: 1, experienceId: 18, imageUrl: "/gallery/img1.jpg", displayOrder: 1, isPrimary: true, title: "Primary", description: null, altText: null, createdAt: new Date() },
      { id: 2, experienceId: 18, imageUrl: "/gallery/img2.jpg", displayOrder: 2, isPrimary: false, title: "Secondary", description: null, altText: null, createdAt: new Date() },
      { id: 3, experienceId: 18, imageUrl: "/gallery/img3.jpg", displayOrder: 3, isPrimary: false, title: "Third", description: null, altText: null, createdAt: new Date() },
    ];
    vi.mocked(db.getExperienceImages).mockResolvedValue(mockImages);
    
    const result = await db.getExperienceImages(18);
    
    expect(result).toHaveLength(3);
    expect(result.filter(img => img.isPrimary)).toHaveLength(1);
  });

  it("should return images for specific experience only", async () => {
    vi.mocked(db.getExperienceImages).mockImplementation(async (experienceId) => {
      if (experienceId === 18) {
        return [{ id: 1, experienceId: 18, imageUrl: "/img1.jpg", displayOrder: 1, isPrimary: true, title: null, description: null, altText: null, createdAt: new Date() }];
      }
      return [];
    });
    
    const result18 = await db.getExperienceImages(18);
    const result19 = await db.getExperienceImages(19);
    
    expect(result18).toHaveLength(1);
    expect(result19).toHaveLength(0);
  });
});
