import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Experiencias Turísticas Comunitarias
  experiences: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        state: z.string().optional(),
        category: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getExperiences(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getExperienceById(input.id);
      }),

    getStates: publicProcedure.query(async () => {
      return await db.getExperienceStates();
    }),

    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getExperiences({ featured: true, limit: input?.limit || 6 });
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        state: z.string().min(1),
        municipality: z.string().optional(),
        community: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        category: z.enum(["ecoturismo", "turismo_rural", "turismo_aventura", "turismo_cultural", "observacion_naturaleza", "gastronomia"]).optional(),
        imageUrl: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden crear experiencias");
        }
        return await db.createExperience(input);
      }),
  }),

  // Distintivos / Certificaciones
  badges: router({
    list: publicProcedure.query(async () => {
      return await db.getBadges();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBadgeById(input.id);
      }),

    getForExperience: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getExperienceBadges(input.experienceId);
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        level: z.enum(["semilla", "excelencia"]).optional(),
        iconUrl: z.string().optional(),
        requirements: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden crear distintivos");
        }
        return await db.createBadge(input);
      }),
  }),

  // Recursos Educativos
  resources: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        type: z.string().optional(),
        category: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getResources(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getResourceById(input.id);
      }),

    download: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementResourceDownload(input.id);
        const resource = await db.getResourceById(input.id);
        return resource;
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        type: z.enum(["guia", "manual", "infografia", "video", "documento", "normativa"]).optional(),
        category: z.string().optional(),
        fileUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        author: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden crear recursos");
        }
        return await db.createResource(input);
      }),
  }),

  // Solicitudes de Contacto
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1, "El nombre es requerido"),
        email: z.string().email("Email inválido"),
        phone: z.string().optional(),
        organization: z.string().optional(),
        state: z.string().optional(),
        message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
        type: z.enum(["informacion_general", "registro_comunidad", "distintivo", "capacitacion", "otro"]).optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createContactRequest(input);
        return { success: true, message: "Solicitud enviada correctamente" };
      }),

    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden ver solicitudes");
        }
        return await db.getContactRequests(input);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["nuevo", "en_proceso", "resuelto"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden actualizar solicitudes");
        }
        await db.updateContactRequestStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Cursos del Campus Virtual
  courses: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().optional(),
        category: z.string().optional(),
        level: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getCourses(input);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseById(input.id);
      }),

    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getCourses({ featured: true, limit: input?.limit || 4 });
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        category: z.string().optional(),
        duration: z.string().optional(),
        level: z.enum(["basico", "intermedio", "avanzado"]).optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden crear cursos");
        }
        return await db.createCourse(input);
      }),
  }),

  // Estadísticas generales
  stats: router({
    get: publicProcedure.query(async () => {
      return await db.getStats();
    }),
  }),

  // Admin: Seed database
  admin: router({
    seed: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Solo administradores pueden ejecutar seed");
      }
      await db.seedDatabase();
      return { success: true, message: "Base de datos poblada correctamente" };
    }),
  }),
});

export type AppRouter = typeof appRouter;
