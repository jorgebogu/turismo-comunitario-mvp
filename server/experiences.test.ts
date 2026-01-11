import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  getExperiences: vi.fn(),
  getExperienceById: vi.fn(),
  getExperienceStates: vi.fn(),
  getBadges: vi.fn(),
  getResources: vi.fn(),
  getCourses: vi.fn(),
  getStats: vi.fn(),
  createContactRequest: vi.fn(),
}));

import * as db from "./db";

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

describe("experiences router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list experiences", async () => {
    const mockExperiences = [
      {
        id: 1,
        name: "Ecoturismo Lacandón",
        state: "Chiapas",
        category: "ecoturismo",
        isFeatured: true,
      },
      {
        id: 2,
        name: "Avistamiento de Ballenas",
        state: "Baja California Sur",
        category: "observacion_naturaleza",
        isFeatured: true,
      },
    ];

    vi.mocked(db.getExperiences).mockResolvedValue(mockExperiences as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.experiences.list();

    expect(result).toEqual(mockExperiences);
    expect(db.getExperiences).toHaveBeenCalled();
  });

  it("should get experience by id", async () => {
    const mockExperience = {
      id: 1,
      name: "Ecoturismo Lacandón",
      description: "Explora la selva lacandona",
      state: "Chiapas",
      category: "ecoturismo",
    };

    vi.mocked(db.getExperienceById).mockResolvedValue(mockExperience as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.experiences.getById({ id: 1 });

    expect(result).toEqual(mockExperience);
    expect(db.getExperienceById).toHaveBeenCalledWith(1);
  });

  it("should get featured experiences", async () => {
    const mockFeatured = [
      { id: 1, name: "Featured 1", isFeatured: true },
      { id: 2, name: "Featured 2", isFeatured: true },
    ];

    vi.mocked(db.getExperiences).mockResolvedValue(mockFeatured as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.experiences.getFeatured({ limit: 2 });

    expect(result).toEqual(mockFeatured);
    expect(db.getExperiences).toHaveBeenCalledWith({ featured: true, limit: 2 });
  });

  it("should get experience states", async () => {
    const mockStates = ["Chiapas", "Oaxaca", "Yucatán"];

    vi.mocked(db.getExperienceStates).mockResolvedValue(mockStates);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.experiences.getStates();

    expect(result).toEqual(mockStates);
    expect(db.getExperienceStates).toHaveBeenCalled();
  });
});

describe("badges router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list badges", async () => {
    const mockBadges = [
      { id: 1, name: "Distintivo Semilla", level: "semilla" },
      { id: 2, name: "Distintivo Excelencia", level: "excelencia" },
    ];

    vi.mocked(db.getBadges).mockResolvedValue(mockBadges as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.badges.list();

    expect(result).toEqual(mockBadges);
    expect(db.getBadges).toHaveBeenCalled();
  });
});

describe("resources router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list resources", async () => {
    const mockResources = [
      { id: 1, title: "Guía de Buenas Prácticas", type: "guia" },
      { id: 2, title: "Manual de Conservación", type: "manual" },
    ];

    vi.mocked(db.getResources).mockResolvedValue(mockResources as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.resources.list();

    expect(result).toEqual(mockResources);
    expect(db.getResources).toHaveBeenCalled();
  });
});

describe("courses router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list courses", async () => {
    const mockCourses = [
      { id: 1, title: "Introducción al Turismo", level: "basico" },
      { id: 2, title: "Conservación Avanzada", level: "avanzado" },
    ];

    vi.mocked(db.getCourses).mockResolvedValue(mockCourses as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.courses.list();

    expect(result).toEqual(mockCourses);
    expect(db.getCourses).toHaveBeenCalled();
  });

  it("should get featured courses", async () => {
    const mockFeatured = [
      { id: 1, title: "Featured Course", isFeatured: true },
    ];

    vi.mocked(db.getCourses).mockResolvedValue(mockFeatured as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.courses.getFeatured({ limit: 3 });

    expect(result).toEqual(mockFeatured);
    expect(db.getCourses).toHaveBeenCalledWith({ featured: true, limit: 3 });
  });
});

describe("stats router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get stats", async () => {
    const mockStats = {
      experiences: 8,
      badges: 2,
      resources: 5,
      courses: 5,
    };

    vi.mocked(db.getStats).mockResolvedValue(mockStats);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stats.get();

    expect(result).toEqual(mockStats);
    expect(db.getStats).toHaveBeenCalled();
  });
});

describe("contact router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit contact request", async () => {
    vi.mocked(db.createContactRequest).mockResolvedValue({} as any);

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const contactData = {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      message: "Quiero registrar mi comunidad en la plataforma",
      type: "registro_comunidad" as const,
    };

    const result = await caller.contact.submit(contactData);

    expect(result).toEqual({ success: true, message: "Solicitud enviada correctamente" });
    expect(db.createContactRequest).toHaveBeenCalledWith(contactData);
  });
});
