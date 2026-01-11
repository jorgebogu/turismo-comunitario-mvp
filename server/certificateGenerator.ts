import { nanoid } from "nanoid";

/**
 * Genera un código único de verificación para certificados
 */
export function generateCertificateCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = nanoid(8).toUpperCase();
  return `TCS-${timestamp}-${random}`;
}

/**
 * Formatea una fecha en español
 */
export function formatDateSpanish(date: Date): string {
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Genera el HTML del certificado para conversión a PDF
 */
export function generateCertificateHTML(data: {
  userName: string;
  courseTitle: string;
  courseLevel: string;
  certificateCode: string;
  issuedAt: Date;
  duration?: string;
}): string {
  const { userName, courseTitle, courseLevel, certificateCode, issuedAt, duration } = data;
  const formattedDate = formatDateSpanish(issuedAt);
  
  const levelLabels: Record<string, string> = {
    basico: "Nivel Básico",
    intermedio: "Nivel Intermedio",
    avanzado: "Nivel Avanzado",
  };
  
  const levelLabel = levelLabels[courseLevel] || courseLevel;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado - ${courseTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Open+Sans:wght@400;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Open Sans', sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .certificate {
      width: 1000px;
      height: 700px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 3px solid #1a5f2a;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .certificate::before {
      content: '';
      position: absolute;
      top: 15px;
      left: 15px;
      right: 15px;
      bottom: 15px;
      border: 2px solid #c9a227;
      border-radius: 4px;
      pointer-events: none;
    }
    
    .corner-decoration {
      position: absolute;
      width: 80px;
      height: 80px;
      opacity: 0.15;
    }
    
    .corner-decoration.top-left {
      top: 25px;
      left: 25px;
      border-top: 4px solid #1a5f2a;
      border-left: 4px solid #1a5f2a;
    }
    
    .corner-decoration.top-right {
      top: 25px;
      right: 25px;
      border-top: 4px solid #1a5f2a;
      border-right: 4px solid #1a5f2a;
    }
    
    .corner-decoration.bottom-left {
      bottom: 25px;
      left: 25px;
      border-bottom: 4px solid #1a5f2a;
      border-left: 4px solid #1a5f2a;
    }
    
    .corner-decoration.bottom-right {
      bottom: 25px;
      right: 25px;
      border-bottom: 4px solid #1a5f2a;
      border-right: 4px solid #1a5f2a;
    }
    
    .content {
      position: relative;
      z-index: 1;
      padding: 50px 60px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    
    .header {
      text-align: center;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    
    .logo-icon {
      width: 40px;
      height: 40px;
      background: #1a5f2a;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }
    
    .logo-text {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      color: #1a5f2a;
      font-weight: 600;
    }
    
    .logo-text span {
      color: #c9a227;
    }
    
    .certificate-title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      color: #1a5f2a;
      letter-spacing: 8px;
      text-transform: uppercase;
      margin-top: 15px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #666;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-top: 8px;
    }
    
    .main-content {
      text-align: center;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 0;
    }
    
    .certifies-text {
      font-size: 16px;
      color: #555;
      margin-bottom: 15px;
    }
    
    .recipient-name {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      color: #1a5f2a;
      font-weight: 700;
      margin-bottom: 20px;
      border-bottom: 2px solid #c9a227;
      padding-bottom: 10px;
      display: inline-block;
    }
    
    .completion-text {
      font-size: 16px;
      color: #555;
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .course-name {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      color: #333;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .course-details {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 10px;
    }
    
    .detail-badge {
      background: linear-gradient(135deg, #1a5f2a 0%, #2d7a3e 100%);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .detail-badge.gold {
      background: linear-gradient(135deg, #c9a227 0%, #d4af37 100%);
    }
    
    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 20px;
    }
    
    .signature-block {
      text-align: center;
      min-width: 200px;
    }
    
    .signature-line {
      width: 180px;
      height: 1px;
      background: #333;
      margin: 0 auto 8px;
    }
    
    .signature-name {
      font-size: 12px;
      color: #333;
      font-weight: 600;
    }
    
    .signature-title {
      font-size: 10px;
      color: #666;
    }
    
    .date-block {
      text-align: center;
    }
    
    .date-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .date-value {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }
    
    .verification-block {
      text-align: center;
    }
    
    .verification-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    
    .verification-code {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #1a5f2a;
      font-weight: 600;
      background: #f0f7f1;
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid #1a5f2a;
    }
    
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Playfair Display', serif;
      font-size: 150px;
      color: rgba(26, 95, 42, 0.03);
      font-weight: 700;
      pointer-events: none;
      white-space: nowrap;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
    <div class="watermark">TCS</div>
    
    <div class="content">
      <div class="header">
        <div class="logo-container">
          <div class="logo-icon">🌿</div>
          <div class="logo-text">Turismo <span>Comunitario</span> Sostenible</div>
        </div>
        <h1 class="certificate-title">Certificado</h1>
        <p class="subtitle">de Capacitación en Turismo Comunitario</p>
      </div>
      
      <div class="main-content">
        <p class="certifies-text">Se otorga el presente certificado a</p>
        <h2 class="recipient-name">${userName}</h2>
        <p class="completion-text">
          Por haber completado satisfactoriamente el curso de capacitación
        </p>
        <h3 class="course-name">"${courseTitle}"</h3>
        <div class="course-details">
          <span class="detail-badge">${levelLabel}</span>
          ${duration ? `<span class="detail-badge gold">${duration}</span>` : ''}
        </div>
      </div>
      
      <div class="footer">
        <div class="signature-block">
          <div class="signature-line"></div>
          <p class="signature-name">Dirección General</p>
          <p class="signature-title">Turismo Comunitario Sostenible</p>
        </div>
        
        <div class="date-block">
          <p class="date-label">Fecha de Emisión</p>
          <p class="date-value">${formattedDate}</p>
        </div>
        
        <div class="verification-block">
          <p class="verification-label">Código de Verificación</p>
          <p class="verification-code">${certificateCode}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
