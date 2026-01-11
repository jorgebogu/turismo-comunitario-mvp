import { describe, expect, it, vi } from "vitest";
import {
  notifyNewReservation,
  notifyReservationStatusChange,
  generateVisitorConfirmationEmail,
  generateVisitorRejectionEmail,
  generateCommunityNewReservationEmail,
  generateVisitReminderEmail,
  ReservationEmailData,
  CommunityEmailData,
} from "./emailNotifications";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

const mockReservationData: ReservationEmailData = {
  reservationId: 1,
  experienceName: "Reserva de la Biosfera Sian Ka'an",
  experienceLocation: "Felipe Carrillo Puerto, Quintana Roo",
  visitorName: "Juan Pérez",
  visitorEmail: "juan@example.com",
  visitorPhone: "+52 555 123 4567",
  visitDate: new Date("2026-02-15"),
  numberOfAdults: 2,
  numberOfChildren: 1,
  message: "Estamos muy emocionados por esta visita",
};

const mockCommunityData: CommunityEmailData = {
  communityName: "Comunidad Sian Ka'an",
  communityEmail: "comunidad@siankaan.org",
};

describe("Email Notifications", () => {
  describe("notifyNewReservation", () => {
    it("should send notification for new reservation", async () => {
      const result = await notifyNewReservation(mockReservationData);
      expect(result).toBe(true);
    });

    it("should include all reservation details in notification", async () => {
      const { notifyOwner } = await import("./_core/notification");
      await notifyNewReservation(mockReservationData);
      
      expect(notifyOwner).toHaveBeenCalled();
      const call = vi.mocked(notifyOwner).mock.calls[0][0];
      expect(call.title).toContain("Nueva Reservación");
      expect(call.title).toContain(mockReservationData.experienceName);
      expect(call.content).toContain(mockReservationData.visitorName);
      expect(call.content).toContain(mockReservationData.visitorEmail);
    });
  });

  describe("notifyReservationStatusChange", () => {
    it("should send notification for confirmed reservation", async () => {
      const result = await notifyReservationStatusChange(mockReservationData, "confirmed");
      expect(result).toBe(true);
    });

    it("should send notification for rejected reservation", async () => {
      const dataWithReason = {
        ...mockReservationData,
        rejectionReason: "Fecha no disponible",
      };
      const result = await notifyReservationStatusChange(dataWithReason, "rejected");
      expect(result).toBe(true);
    });

    it("should include correct emoji for each status", async () => {
      const { notifyOwner } = await import("./_core/notification");
      
      await notifyReservationStatusChange(mockReservationData, "confirmed");
      let call = vi.mocked(notifyOwner).mock.calls[vi.mocked(notifyOwner).mock.calls.length - 1][0];
      expect(call.title).toContain("✅");
      
      await notifyReservationStatusChange(mockReservationData, "rejected");
      call = vi.mocked(notifyOwner).mock.calls[vi.mocked(notifyOwner).mock.calls.length - 1][0];
      expect(call.title).toContain("❌");
      
      await notifyReservationStatusChange(mockReservationData, "cancelled");
      call = vi.mocked(notifyOwner).mock.calls[vi.mocked(notifyOwner).mock.calls.length - 1][0];
      expect(call.title).toContain("🚫");
      
      await notifyReservationStatusChange(mockReservationData, "completed");
      call = vi.mocked(notifyOwner).mock.calls[vi.mocked(notifyOwner).mock.calls.length - 1][0];
      expect(call.title).toContain("🎉");
    });
  });

  describe("generateVisitorConfirmationEmail", () => {
    it("should generate confirmation email with all details", () => {
      const email = generateVisitorConfirmationEmail(mockReservationData);
      
      expect(email.subject).toContain("confirmada");
      expect(email.subject).toContain(mockReservationData.experienceName);
      expect(email.htmlContent).toContain(mockReservationData.visitorName);
      expect(email.htmlContent).toContain(mockReservationData.experienceName);
      expect(email.htmlContent).toContain(mockReservationData.experienceLocation);
      expect(email.textContent).toContain(mockReservationData.visitorName);
    });

    it("should include recommendations section", () => {
      const email = generateVisitorConfirmationEmail(mockReservationData);
      
      expect(email.htmlContent).toContain("Recomendaciones");
      expect(email.htmlContent).toContain("protector solar");
      expect(email.textContent).toContain("RECOMENDACIONES");
    });

    it("should format visitor count correctly", () => {
      const email = generateVisitorConfirmationEmail(mockReservationData);
      
      expect(email.htmlContent).toContain("2 adultos");
      expect(email.htmlContent).toContain("1 niño");
    });
  });

  describe("generateVisitorRejectionEmail", () => {
    it("should generate rejection email with reason", () => {
      const dataWithReason = {
        ...mockReservationData,
        rejectionReason: "La fecha solicitada no está disponible",
      };
      const email = generateVisitorRejectionEmail(dataWithReason);
      
      expect(email.subject).toContain("Actualización");
      expect(email.htmlContent).toContain(dataWithReason.rejectionReason);
      expect(email.textContent).toContain(dataWithReason.rejectionReason);
    });

    it("should include call to action to explore other experiences", () => {
      const email = generateVisitorRejectionEmail(mockReservationData);
      
      expect(email.htmlContent).toContain("Explorar Experiencias");
      expect(email.textContent).toContain("explorar otras experiencias");
    });
  });

  describe("generateCommunityNewReservationEmail", () => {
    it("should generate email for community with all visitor details", () => {
      const email = generateCommunityNewReservationEmail(mockReservationData, mockCommunityData);
      
      expect(email.subject).toContain("Nueva solicitud");
      expect(email.htmlContent).toContain(mockCommunityData.communityName);
      expect(email.htmlContent).toContain(mockReservationData.visitorName);
      expect(email.htmlContent).toContain(mockReservationData.visitorEmail);
      expect(email.htmlContent).toContain(mockReservationData.visitorPhone);
    });

    it("should include visitor message if provided", () => {
      const email = generateCommunityNewReservationEmail(mockReservationData, mockCommunityData);
      
      expect(email.htmlContent).toContain(mockReservationData.message);
      expect(email.textContent).toContain(mockReservationData.message);
    });

    it("should include confirm and reject buttons", () => {
      const email = generateCommunityNewReservationEmail(mockReservationData, mockCommunityData);
      
      expect(email.htmlContent).toContain("Confirmar");
      expect(email.htmlContent).toContain("Rechazar");
    });
  });

  describe("generateVisitReminderEmail", () => {
    it("should generate reminder for tomorrow", () => {
      const email = generateVisitReminderEmail(mockReservationData, 1);
      
      expect(email.subject).toContain("mañana");
      expect(email.htmlContent).toContain("mañana");
    });

    it("should generate reminder for multiple days", () => {
      const email = generateVisitReminderEmail(mockReservationData, 3);
      
      expect(email.subject).toContain("3 días");
      expect(email.htmlContent).toContain("3 días");
    });

    it("should include packing checklist", () => {
      const email = generateVisitReminderEmail(mockReservationData, 1);
      
      expect(email.htmlContent).toContain("No olvides llevar");
      expect(email.htmlContent).toContain("Identificación oficial");
      expect(email.htmlContent).toContain("Protector solar");
      expect(email.textContent).toContain("NO OLVIDES LLEVAR");
    });
  });

  describe("Email formatting", () => {
    it("should format dates in Spanish", () => {
      const email = generateVisitorConfirmationEmail(mockReservationData);
      
      // Should contain Spanish month name
      expect(email.htmlContent).toMatch(/febrero/i);
      expect(email.textContent).toMatch(/febrero/i);
    });

    it("should handle singular/plural correctly for visitors", () => {
      const singleAdult = {
        ...mockReservationData,
        numberOfAdults: 1,
        numberOfChildren: 0,
      };
      const email = generateVisitorConfirmationEmail(singleAdult);
      
      expect(email.htmlContent).toContain("1 adulto");
      expect(email.htmlContent).not.toContain("1 adultos");
    });

    it("should generate valid HTML structure", () => {
      const email = generateVisitorConfirmationEmail(mockReservationData);
      
      expect(email.htmlContent).toContain("<!DOCTYPE html>");
      expect(email.htmlContent).toContain("<html");
      expect(email.htmlContent).toContain("</html>");
      expect(email.htmlContent).toContain("<body");
      expect(email.htmlContent).toContain("</body>");
    });
  });
});
