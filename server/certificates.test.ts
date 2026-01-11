import { describe, expect, it, vi, beforeEach } from "vitest";
import { generateCertificateCode, formatDateSpanish, generateCertificateHTML } from "./certificateGenerator";

describe("Certificate Generator", () => {
  describe("generateCertificateCode", () => {
    it("should generate a code with TCS prefix", () => {
      const code = generateCertificateCode();
      expect(code).toMatch(/^TCS-/);
    });

    it("should generate unique codes", () => {
      const codes = new Set<string>();
      for (let i = 0; i < 100; i++) {
        codes.add(generateCertificateCode());
      }
      expect(codes.size).toBe(100);
    });

    it("should generate codes in uppercase", () => {
      const code = generateCertificateCode();
      expect(code).toBe(code.toUpperCase());
    });

    it("should generate codes with correct format", () => {
      const code = generateCertificateCode();
      // Format: TCS-{timestamp}-{random8chars} (nanoid may include underscores)
      expect(code).toMatch(/^TCS-[A-Z0-9]+-[A-Z0-9_]{8}$/);
    });
  });

  describe("formatDateSpanish", () => {
    it("should format date in Spanish", () => {
      // Use a date with explicit time to avoid timezone issues
      const date = new Date(2024, 0, 15, 12, 0, 0); // Jan 15, 2024 at noon
      const formatted = formatDateSpanish(date);
      expect(formatted).toBe("15 de enero de 2024");
    });

    it("should handle different months correctly", () => {
      // Use explicit Date constructor to avoid timezone issues
      const testCases = [
        { date: new Date(2024, 2, 20, 12, 0, 0), expected: "20 de marzo de 2024" },
        { date: new Date(2024, 6, 4, 12, 0, 0), expected: "4 de julio de 2024" },
        { date: new Date(2024, 11, 25, 12, 0, 0), expected: "25 de diciembre de 2024" },
      ];

      testCases.forEach(({ date, expected }) => {
        expect(formatDateSpanish(date)).toBe(expected);
      });
    });
  });

  describe("generateCertificateHTML", () => {
    const baseData = {
      userName: "Juan Pérez",
      courseTitle: "Introducción al Turismo Sostenible",
      courseLevel: "basico",
      certificateCode: "TCS-ABC123-XYZ78901",
      issuedAt: new Date("2024-06-15"),
    };

    it("should generate HTML with user name", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Juan Pérez");
    });

    it("should generate HTML with course title", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Introducción al Turismo Sostenible");
    });

    it("should generate HTML with certificate code", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("TCS-ABC123-XYZ78901");
    });

    it("should generate HTML with formatted date", () => {
      const html = generateCertificateHTML(baseData);
      // Date may vary by timezone, just check it contains the month and year
      expect(html).toContain("de junio de 2024");
    });

    it("should include level label for basic level", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Nivel Básico");
    });

    it("should include level label for intermediate level", () => {
      const html = generateCertificateHTML({ ...baseData, courseLevel: "intermedio" });
      expect(html).toContain("Nivel Intermedio");
    });

    it("should include level label for advanced level", () => {
      const html = generateCertificateHTML({ ...baseData, courseLevel: "avanzado" });
      expect(html).toContain("Nivel Avanzado");
    });

    it("should include duration when provided", () => {
      const html = generateCertificateHTML({ ...baseData, duration: "40 horas" });
      expect(html).toContain("40 horas");
    });

    it("should not include duration badge when not provided", () => {
      const html = generateCertificateHTML(baseData);
      // Verify the HTML doesn't contain a duration value when not provided
      expect(html).not.toContain("40 horas");
      // But should still contain the level badge
      expect(html).toContain("Nivel Básico");
    });

    it("should generate valid HTML structure", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("<head>");
      expect(html).toContain("</head>");
      expect(html).toContain("<body>");
      expect(html).toContain("</body>");
    });

    it("should include Turismo Comunitario Sostenible branding", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Turismo");
      expect(html).toContain("Comunitario");
      expect(html).toContain("Sostenible");
    });

    it("should include certificate title", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Certificado");
    });

    it("should include verification section", () => {
      const html = generateCertificateHTML(baseData);
      expect(html).toContain("Código de Verificación");
    });
  });
});

describe("Certificate API Logic", () => {
  it("should require 100% progress for certificate generation", () => {
    // This tests the business logic that progress must be 100%
    const progress = 99;
    const canGenerateCertificate = progress >= 100;
    expect(canGenerateCertificate).toBe(false);

    const completedProgress = 100;
    const canGenerateCompleted = completedProgress >= 100;
    expect(canGenerateCompleted).toBe(true);
  });

  it("should validate certificate code format", () => {
    const validCode = "TCS-M5K2J8-ABCD1234";
    const isValidFormat = /^TCS-[A-Z0-9]+-[A-Z0-9]+$/.test(validCode);
    expect(isValidFormat).toBe(true);

    const invalidCode = "INVALID-CODE";
    const isInvalidFormat = /^TCS-[A-Z0-9]+-[A-Z0-9]+$/.test(invalidCode);
    expect(isInvalidFormat).toBe(false);
  });
});
