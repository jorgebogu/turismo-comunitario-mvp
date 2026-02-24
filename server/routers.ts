import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyNewReservation, notifyReservationStatusChange, ReservationEmailData } from "./emailNotifications";

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
        page: z.number().optional(),
        state: z.string().optional(),
        category: z.string().optional(),
        featured: z.boolean().optional(),
        sort: z.string().optional(),
        search: z.string().optional(),
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
        const result = await db.getExperiences({ featured: true, limit: input?.limit || 6 });
        return result.data;
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

    // Galería de imágenes de experiencias
    getImages: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getExperienceImages(input.experienceId);
      }),

    addImage: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        imageUrl: z.string().url(),
        title: z.string().optional(),
        description: z.string().optional(),
        altText: z.string().optional(),
        displayOrder: z.number().optional(),
        isPrimary: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden agregar imágenes");
        }
        return await db.createExperienceImage(input);
      }),

    deleteImage: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden eliminar imágenes");
        }
        return await db.deleteExperienceImage(input.id);
      }),

    setPrimaryImage: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        imageId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Solo administradores pueden cambiar la imagen principal");
        }
        return await db.setPrimaryImage(input.experienceId, input.imageId);
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

  // Reseñas y Calificaciones
  reviews: router({
    getByExperience: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewsByExperience(input.experienceId);
      }),

    getStats: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getReviewStats(input.experienceId);
      }),

    getUserReview: protectedProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getUserReviewForExperience(input.experienceId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().max(200).optional(),
        comment: z.string().optional(),
        visitDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.createReview({
          ...input,
          userId: ctx.user.id,
        });
        return { success: true, message: "Reseña publicada correctamente" };
      }),

    delete: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteReview(input.reviewId, ctx.user.id);
        return { success: true, message: "Reseña eliminada correctamente" };
      }),

    markHelpful: publicProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementReviewHelpful(input.reviewId);
        return { success: true };
      }),
  }),

  // Inscripciones a Cursos
  enrollments: router({
    // Inscribirse a un curso
    enroll: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.enrollInCourse({
          courseId: input.courseId,
          userId: ctx.user.id,
        });
        if (result.alreadyEnrolled) {
          return { success: true, message: "Ya estás inscrito en este curso", alreadyEnrolled: true };
        }
        return { success: true, message: "Inscripción exitosa", alreadyEnrolled: false };
      }),

    // Obtener inscripciones del usuario
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserEnrollments(ctx.user.id);
    }),

    // Verificar si el usuario está inscrito en un curso
    checkEnrollment: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input, ctx }) => {
        const enrollment = await db.getEnrollmentByCourseAndUser(input.courseId, ctx.user.id);
        return { isEnrolled: !!enrollment, enrollment };
      }),

    // Actualizar progreso del curso
    updateProgress: protectedProcedure
      .input(z.object({
        enrollmentId: z.number(),
        progress: z.number().min(0).max(100),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verificar que la inscripción pertenece al usuario
        const enrollments = await db.getUserEnrollments(ctx.user.id);
        const enrollment = enrollments.find(e => e.enrollment.id === input.enrollmentId);
        if (!enrollment) {
          throw new Error("Inscripción no encontrada");
        }
        await db.updateEnrollmentProgress(input.enrollmentId, input.progress);
        return { success: true, message: "Progreso actualizado" };
      }),

    // Abandonar curso
    drop: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.dropEnrollment(input.enrollmentId, ctx.user.id);
        return { success: true, message: "Has abandonado el curso" };
      }),

    // Obtener estadísticas del usuario
    myStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserEnrollmentStats(ctx.user.id);
    }),

    // Obtener número de inscritos en un curso (público)
    getCourseEnrollmentCount: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseEnrollmentCount(input.courseId);
      }),
  }),

  // Certificados de Cursos
  certificates: router({
    // Generar certificado para un curso completado
    generate: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        // Verificar que la inscripción pertenece al usuario y está completada
        const enrollments = await db.getUserEnrollments(ctx.user.id);
        const enrollment = enrollments.find(e => e.enrollment.id === input.enrollmentId);
        
        if (!enrollment) {
          throw new Error("Inscripción no encontrada");
        }
        
        if ((enrollment.enrollment.progress ?? 0) < 100) {
          throw new Error("Debes completar el curso al 100% para obtener el certificado");
        }
        
        // Verificar si ya existe un certificado
        const existingCert = await db.getCertificateByEnrollment(input.enrollmentId);
        if (existingCert) {
          return { 
            success: true, 
            message: "Certificado ya generado", 
            certificate: existingCert,
            alreadyExists: true 
          };
        }
        
        // Generar código único
        const { generateCertificateCode } = await import("./certificateGenerator");
        const certificateCode = generateCertificateCode();
        
        // Crear certificado
        const result = await db.createCertificate({
          enrollmentId: input.enrollmentId,
          userId: ctx.user.id,
          courseId: enrollment.course!.id,
          certificateCode,
          userName: ctx.user.name || "Participante",
          courseTitle: enrollment.course!.title,
          courseLevel: enrollment.course!.level || "basico",
          issuedAt: new Date(),
        });
        
        const certificate = await db.getCertificateByEnrollment(input.enrollmentId);
        
        return { 
          success: true, 
          message: "Certificado generado exitosamente", 
          certificate,
          alreadyExists: false 
        };
      }),

    // Obtener certificados del usuario
    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCertificates(ctx.user.id);
    }),

    // Obtener certificado por inscripción
    getByEnrollment: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCertificateByEnrollment(input.enrollmentId);
      }),

    // Verificar certificado por código (público)
    verify: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const certificate = await db.getCertificateByCode(input.code);
        if (!certificate) {
          return { valid: false, message: "Certificado no encontrado" };
        }
        if (!certificate.isValid) {
          return { valid: false, message: "Certificado inválido o revocado" };
        }
        return { 
          valid: true, 
          message: "Certificado válido",
          certificate: {
            userName: certificate.userName,
            courseTitle: certificate.courseTitle,
            courseLevel: certificate.courseLevel,
            issuedAt: certificate.issuedAt,
            certificateCode: certificate.certificateCode,
          }
        };
      }),

    // Generar HTML del certificado para descarga
    getHtml: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .query(async ({ input, ctx }) => {
        const certificate = await db.getCertificateByEnrollment(input.enrollmentId);
        if (!certificate || certificate.userId !== ctx.user.id) {
          throw new Error("Certificado no encontrado");
        }
        
        const enrollments = await db.getUserEnrollments(ctx.user.id);
        const enrollment = enrollments.find(e => e.enrollment.id === input.enrollmentId);
        
        const { generateCertificateHTML } = await import("./certificateGenerator");
        const html = generateCertificateHTML({
          userName: certificate.userName,
          courseTitle: certificate.courseTitle,
          courseLevel: certificate.courseLevel || "basico",
          certificateCode: certificate.certificateCode,
          issuedAt: certificate.issuedAt,
          duration: enrollment?.course?.duration ?? undefined,
        });
        
        return { html, certificate };
      }),
  }),

  // Reservaciones
  reservations: router({
    // Crear una solicitud de reserva
    create: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        visitorName: z.string().min(2),
        visitorEmail: z.string().email(),
        visitorPhone: z.string().optional(),
        visitDate: z.string(), // ISO date string
        visitEndDate: z.string().optional(),
        numberOfAdults: z.number().min(1).default(1),
        numberOfChildren: z.number().min(0).default(0),
        message: z.string().optional(),
        specialRequirements: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get experience details for notification
        const experience = await db.getExperienceById(input.experienceId);
        
        const result = await db.createReservation({
          experienceId: input.experienceId,
          userId: ctx.user.id,
          visitorName: input.visitorName,
          visitorEmail: input.visitorEmail,
          visitorPhone: input.visitorPhone || null,
          visitDate: new Date(input.visitDate),
          visitEndDate: input.visitEndDate ? new Date(input.visitEndDate) : null,
          numberOfAdults: input.numberOfAdults,
          numberOfChildren: input.numberOfChildren || 0,
          message: input.message || null,
          specialRequirements: input.specialRequirements || null,
          status: "pendiente",
        });
        
        // Send notification to platform owner about new reservation
        if (experience) {
          const emailData: ReservationEmailData = {
            reservationId: (result as any).insertId || 0,
            experienceName: experience.name,
            experienceLocation: `${experience.community}, ${experience.state}`,
            visitorName: input.visitorName,
            visitorEmail: input.visitorEmail,
            visitorPhone: input.visitorPhone,
            visitDate: new Date(input.visitDate),
            numberOfAdults: input.numberOfAdults,
            numberOfChildren: input.numberOfChildren,
            message: input.message,
          };
          // Fire and forget - don't block the response
          notifyNewReservation(emailData).catch(err => 
            console.warn('[Notification] Failed to send new reservation notification:', err)
          );
        }
        
        return { success: true, message: "Solicitud de reserva enviada exitosamente" };
      }),

    // Obtener reservaciones del usuario
    myReservations: protectedProcedure.query(async ({ ctx }) => {
      const reservations = await db.getReservationsByUser(ctx.user.id);
      // Enrich with experience data
      const enriched = await Promise.all(
        reservations.map(async (r) => {
          const experience = await db.getExperienceById(r.experienceId);
          return { ...r, experience };
        })
      );
      return enriched;
    }),

    // Obtener una reservación por ID
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const reservation = await db.getReservationById(input.id);
        if (!reservation || reservation.userId !== ctx.user.id) {
          throw new Error("Reservación no encontrada");
        }
        const experience = await db.getExperienceById(reservation.experienceId);
        return { ...reservation, experience };
      }),

    // Cancelar reservación
    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.cancelReservation(input.id, ctx.user.id);
        return { success: true, message: "Reservación cancelada" };
      }),

    // Obtener estadísticas del usuario
    myStats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getReservationStats(ctx.user.id);
    }),
  }),

  // Disponibilidad / Calendario
  availability: router({
    // Obtener datos del calendario para un mes
    getCalendar: publicProcedure
      .input(z.object({
        experienceId: z.number(),
        year: z.number(),
        month: z.number().min(1).max(12),
      }))
      .query(async ({ input }) => {
        return await db.getCalendarData(input.experienceId, input.year, input.month);
      }),

    // Verificar disponibilidad para una fecha específica
    checkDate: publicProcedure
      .input(z.object({
        experienceId: z.number(),
        date: z.string(), // ISO date string
        requestedCapacity: z.number().min(1).default(1),
      }))
      .query(async ({ input }) => {
        return await db.checkAvailability(
          input.experienceId, 
          new Date(input.date), 
          input.requestedCapacity
        );
      }),

    // Obtener configuración de disponibilidad por defecto
    getConfig: publicProcedure
      .input(z.object({ experienceId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAvailabilityConfig(input.experienceId);
      }),

    // Establecer configuración de disponibilidad (admin/comunidad)
    setConfig: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        dayOfWeek: z.number().min(0).max(6),
        defaultCapacity: z.number().min(1).default(20),
        isEnabled: z.boolean().default(true),
      }))
      .mutation(async ({ input, ctx }) => {
        // TODO: Verificar que el usuario es admin o dueño de la experiencia
        await db.setAvailabilityConfig({
          experienceId: input.experienceId,
          dayOfWeek: input.dayOfWeek,
          defaultCapacity: input.defaultCapacity,
          isEnabled: input.isEnabled,
        });
        return { success: true, message: "Configuración actualizada" };
      }),

    // Inicializar disponibilidad por defecto para una experiencia
    initializeDefault: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        defaultCapacity: z.number().min(1).default(20),
      }))
      .mutation(async ({ input }) => {
        await db.initializeDefaultAvailability(input.experienceId, input.defaultCapacity);
        return { success: true, message: "Disponibilidad inicializada" };
      }),

    // Bloquear una fecha
    blockDate: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        date: z.string(), // ISO date string
        reason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.blockDate({
          experienceId: input.experienceId,
          date: new Date(input.date),
          reason: input.reason || null,
        });
        if (result.alreadyBlocked) {
          return { success: true, message: "Esta fecha ya estaba bloqueada" };
        }
        return { success: true, message: "Fecha bloqueada exitosamente" };
      }),

    // Desbloquear una fecha
    unblockDate: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        date: z.string(), // ISO date string
      }))
      .mutation(async ({ input }) => {
        await db.unblockDate(input.experienceId, new Date(input.date));
        return { success: true, message: "Fecha desbloqueada" };
      }),

    // Obtener fechas bloqueadas
    getBlockedDates: publicProcedure
      .input(z.object({
        experienceId: z.number(),
        startDate: z.string(),
        endDate: z.string(),
      }))
      .query(async ({ input }) => {
        return await db.getBlockedDates(
          input.experienceId,
          new Date(input.startDate),
          new Date(input.endDate)
        );
      }),

    // Establecer disponibilidad para una fecha específica
    setDateAvailability: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        date: z.string(),
        maxCapacity: z.number().min(0),
        isAvailable: z.boolean().default(true),
        specialPrice: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createOrUpdateAvailability({
          experienceId: input.experienceId,
          date: new Date(input.date),
          maxCapacity: input.maxCapacity,
          isAvailable: input.isAvailable,
          specialPrice: input.specialPrice?.toString() || null,
          notes: input.notes || null,
        });
        return { success: true, message: "Disponibilidad actualizada" };
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

  // Panel de Administración para Comunidades
  communityAdmin: router({
    // Obtener experiencias que administra el usuario
    myExperiences: protectedProcedure.query(async ({ ctx }) => {
      return await db.getExperiencesByAdmin(ctx.user.id);
    }),

    // Obtener todas las reservaciones (con filtros)
    getReservations: protectedProcedure
      .input(z.object({
        experienceId: z.number().optional(),
        status: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAdminReservations({
          experienceId: input?.experienceId,
          status: input?.status,
          startDate: input?.startDate ? new Date(input.startDate) : undefined,
          endDate: input?.endDate ? new Date(input.endDate) : undefined,
          limit: input?.limit,
        });
      }),

    // Obtener estadísticas de reservaciones
    getStats: protectedProcedure
      .input(z.object({
        experienceId: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAdminReservationStats(input?.experienceId);
      }),

    // Confirmar una reservación
    confirmReservation: protectedProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Get reservation details before confirming
        const reservation = await db.getReservationById(input.id);
        await db.confirmReservation(input.id, input.message);
        
        // Send notification about confirmation
        if (reservation) {
          const experience = await db.getExperienceById(reservation.experienceId);
          if (experience) {
            const emailData: ReservationEmailData = {
              reservationId: input.id,
              experienceName: experience.name,
              experienceLocation: `${experience.community}, ${experience.state}`,
              visitorName: reservation.visitorName,
              visitorEmail: reservation.visitorEmail,
              visitorPhone: reservation.visitorPhone || undefined,
              visitDate: reservation.visitDate,
              numberOfAdults: reservation.numberOfAdults,
              numberOfChildren: reservation.numberOfChildren || undefined,
              status: 'confirmed',
            };
            notifyReservationStatusChange(emailData, 'confirmed').catch(err =>
              console.warn('[Notification] Failed to send confirmation notification:', err)
            );
          }
        }
        
        return { success: true, message: "Reservación confirmada exitosamente" };
      }),

    // Rechazar una reservación
    rejectReservation: protectedProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Get reservation details before rejecting
        const reservation = await db.getReservationById(input.id);
        await db.rejectReservation(input.id, input.message);
        
        // Send notification about rejection
        if (reservation) {
          const experience = await db.getExperienceById(reservation.experienceId);
          if (experience) {
            const emailData: ReservationEmailData = {
              reservationId: input.id,
              experienceName: experience.name,
              experienceLocation: `${experience.community}, ${experience.state}`,
              visitorName: reservation.visitorName,
              visitorEmail: reservation.visitorEmail,
              visitorPhone: reservation.visitorPhone || undefined,
              visitDate: reservation.visitDate,
              numberOfAdults: reservation.numberOfAdults,
              numberOfChildren: reservation.numberOfChildren || undefined,
              status: 'rejected',
              rejectionReason: input.message,
            };
            notifyReservationStatusChange(emailData, 'rejected').catch(err =>
              console.warn('[Notification] Failed to send rejection notification:', err)
            );
          }
        }
        
        return { success: true, message: "Reservación rechazada" };
      }),

    // Marcar reservación como completada
    completeReservation: protectedProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Get reservation details before completing
        const reservation = await db.getReservationById(input.id);
        await db.completeReservation(input.id, input.message);
        
        // Send notification about completion
        if (reservation) {
          const experience = await db.getExperienceById(reservation.experienceId);
          if (experience) {
            const emailData: ReservationEmailData = {
              reservationId: input.id,
              experienceName: experience.name,
              experienceLocation: `${experience.community}, ${experience.state}`,
              visitorName: reservation.visitorName,
              visitorEmail: reservation.visitorEmail,
              visitorPhone: reservation.visitorPhone || undefined,
              visitDate: reservation.visitDate,
              numberOfAdults: reservation.numberOfAdults,
              numberOfChildren: reservation.numberOfChildren || undefined,
              status: 'completed',
            };
            notifyReservationStatusChange(emailData, 'completed').catch(err =>
              console.warn('[Notification] Failed to send completion notification:', err)
            );
          }
        }
        
        return { success: true, message: "Reservación marcada como completada" };
      }),

    // Obtener reservaciones para el calendario
    getCalendarReservations: protectedProcedure
      .input(z.object({
        experienceId: z.number(),
        year: z.number(),
        month: z.number().min(1).max(12),
      }))
      .query(async ({ input }) => {
        return await db.getReservationsForCalendar(input.experienceId, input.year, input.month);
      }),

    // Obtener detalle de una reservación
    getReservationDetail: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const reservation = await db.getReservationById(input.id);
        if (!reservation) {
          throw new Error("Reservación no encontrada");
        }
        const experience = await db.getExperienceById(reservation.experienceId);
        return { ...reservation, experience };
      }),
  }),
});

export type AppRouter = typeof appRouter;
