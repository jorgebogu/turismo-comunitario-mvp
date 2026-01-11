import { notifyOwner } from "./_core/notification";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Types for email notifications
export interface ReservationEmailData {
  reservationId: number;
  experienceName: string;
  experienceLocation: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  visitDate: Date;
  numberOfAdults: number;
  numberOfChildren?: number;
  message?: string;
  status?: string;
  rejectionReason?: string;
}

export interface CommunityEmailData {
  communityName: string;
  communityEmail?: string;
}

// Format date in Spanish
const formatDate = (date: Date): string => {
  return format(new Date(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
};

// Calculate total visitors
const getTotalVisitors = (adults: number, children?: number): string => {
  const total = adults + (children || 0);
  const parts = [`${adults} adulto${adults !== 1 ? 's' : ''}`];
  if (children && children > 0) {
    parts.push(`${children} niño${children !== 1 ? 's' : ''}`);
  }
  return `${total} persona${total !== 1 ? 's' : ''} (${parts.join(', ')})`;
};

/**
 * Notify the platform owner when a new reservation is created
 * This uses the built-in Manus notification system
 */
export async function notifyNewReservation(
  data: ReservationEmailData
): Promise<boolean> {
  const title = `🆕 Nueva Reservación: ${data.experienceName}`;
  
  const content = `
Se ha recibido una nueva solicitud de reservación:

📍 **Experiencia:** ${data.experienceName}
📅 **Fecha de visita:** ${formatDate(data.visitDate)}
👥 **Visitantes:** ${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}

**Datos del visitante:**
- Nombre: ${data.visitorName}
- Email: ${data.visitorEmail}
${data.visitorPhone ? `- Teléfono: ${data.visitorPhone}` : ''}

${data.message ? `**Mensaje del visitante:**\n${data.message}` : ''}

---
Por favor, revisa esta solicitud en el Panel de Administración para confirmarla o rechazarla.
  `.trim();

  return notifyOwner({ title, content });
}

/**
 * Notify the platform owner when a reservation status changes
 */
export async function notifyReservationStatusChange(
  data: ReservationEmailData,
  newStatus: string
): Promise<boolean> {
  const statusEmoji = {
    confirmed: '✅',
    rejected: '❌',
    cancelled: '🚫',
    completed: '🎉',
  }[newStatus] || '📋';

  const statusText = {
    confirmed: 'Confirmada',
    rejected: 'Rechazada',
    cancelled: 'Cancelada',
    completed: 'Completada',
  }[newStatus] || newStatus;

  const title = `${statusEmoji} Reservación ${statusText}: ${data.experienceName}`;
  
  let content = `
La reservación ha sido actualizada:

📍 **Experiencia:** ${data.experienceName}
📅 **Fecha de visita:** ${formatDate(data.visitDate)}
👥 **Visitantes:** ${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}
📊 **Nuevo estado:** ${statusText}

**Datos del visitante:**
- Nombre: ${data.visitorName}
- Email: ${data.visitorEmail}
  `.trim();

  if (newStatus === 'rejected' && data.rejectionReason) {
    content += `\n\n**Motivo del rechazo:** ${data.rejectionReason}`;
  }

  return notifyOwner({ title, content });
}

/**
 * Generate email content for visitor notification (to be sent via external service)
 * Returns the email content that can be used with an email service
 */
export function generateVisitorConfirmationEmail(
  data: ReservationEmailData
): { subject: string; htmlContent: string; textContent: string } {
  const subject = `✅ Tu reservación ha sido confirmada - ${data.experienceName}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reservación Confirmada</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🌿 Turismo Comunitario Sostenible</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu reservación ha sido confirmada</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hola <strong>${data.visitorName}</strong>,</p>
    
    <p>¡Excelentes noticias! Tu reservación ha sido confirmada por la comunidad anfitriona.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #166534;">
      <h2 style="color: #166534; margin-top: 0; font-size: 18px;">📍 Detalles de tu visita</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Experiencia:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.experienceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Ubicación:</td>
          <td style="padding: 8px 0;">${data.experienceLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Fecha:</td>
          <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.visitDate)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Visitantes:</td>
          <td style="padding: 8px 0;">${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e;">
        <strong>📋 Recomendaciones:</strong><br>
        • Llega 15 minutos antes de la hora acordada<br>
        • Lleva ropa y calzado cómodo<br>
        • No olvides protector solar y repelente<br>
        • Respeta las indicaciones de los guías locales
      </p>
    </div>
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      ¡Te esperamos!<br>
      <strong>Equipo de Turismo Comunitario Sostenible</strong>
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>Este correo fue enviado porque solicitaste una reservación en nuestra plataforma.</p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
TURISMO COMUNITARIO SOSTENIBLE
Tu reservación ha sido confirmada

Hola ${data.visitorName},

¡Excelentes noticias! Tu reservación ha sido confirmada por la comunidad anfitriona.

DETALLES DE TU VISITA
---------------------
Experiencia: ${data.experienceName}
Ubicación: ${data.experienceLocation}
Fecha: ${formatDate(data.visitDate)}
Visitantes: ${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}

RECOMENDACIONES
---------------
• Llega 15 minutos antes de la hora acordada
• Lleva ropa y calzado cómodo
• No olvides protector solar y repelente
• Respeta las indicaciones de los guías locales

Si tienes alguna pregunta, no dudes en contactarnos.

¡Te esperamos!
Equipo de Turismo Comunitario Sostenible
  `.trim();

  return { subject, htmlContent, textContent };
}

/**
 * Generate email content for rejection notification
 */
export function generateVisitorRejectionEmail(
  data: ReservationEmailData
): { subject: string; htmlContent: string; textContent: string } {
  const subject = `Actualización sobre tu reservación - ${data.experienceName}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualización de Reservación</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🌿 Turismo Comunitario Sostenible</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Actualización de tu reservación</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hola <strong>${data.visitorName}</strong>,</p>
    
    <p>Lamentamos informarte que tu solicitud de reservación no pudo ser confirmada en esta ocasión.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
      <h2 style="color: #dc2626; margin-top: 0; font-size: 18px;">📍 Detalles de la solicitud</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Experiencia:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.experienceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Fecha solicitada:</td>
          <td style="padding: 8px 0;">${formatDate(data.visitDate)}</td>
        </tr>
      </table>
      ${data.rejectionReason ? `
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <p style="margin: 0; color: #666;"><strong>Motivo:</strong> ${data.rejectionReason}</p>
      </div>
      ` : ''}
    </div>
    
    <p>Te invitamos a explorar otras experiencias disponibles o a intentar con una fecha diferente.</p>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="#" style="display: inline-block; background: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explorar Experiencias</a>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Gracias por tu interés en el turismo comunitario.<br>
      <strong>Equipo de Turismo Comunitario Sostenible</strong>
    </p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
TURISMO COMUNITARIO SOSTENIBLE
Actualización de tu reservación

Hola ${data.visitorName},

Lamentamos informarte que tu solicitud de reservación no pudo ser confirmada en esta ocasión.

DETALLES DE LA SOLICITUD
------------------------
Experiencia: ${data.experienceName}
Fecha solicitada: ${formatDate(data.visitDate)}
${data.rejectionReason ? `Motivo: ${data.rejectionReason}` : ''}

Te invitamos a explorar otras experiencias disponibles o a intentar con una fecha diferente.

Gracias por tu interés en el turismo comunitario.
Equipo de Turismo Comunitario Sostenible
  `.trim();

  return { subject, htmlContent, textContent };
}

/**
 * Generate email content for new reservation notification to community
 */
export function generateCommunityNewReservationEmail(
  data: ReservationEmailData,
  community: CommunityEmailData
): { subject: string; htmlContent: string; textContent: string } {
  const subject = `🆕 Nueva solicitud de reservación - ${data.experienceName}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Reservación</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🌿 Turismo Comunitario Sostenible</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Nueva solicitud de reservación</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hola <strong>${community.communityName}</strong>,</p>
    
    <p>¡Tienes una nueva solicitud de reservación! Un visitante desea conocer tu experiencia.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #166534;">
      <h2 style="color: #166534; margin-top: 0; font-size: 18px;">📋 Detalles de la solicitud</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Experiencia:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.experienceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Fecha solicitada:</td>
          <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.visitDate)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Visitantes:</td>
          <td style="padding: 8px 0;">${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}</td>
        </tr>
      </table>
      
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">👤 Datos del visitante</h3>
        <p style="margin: 5px 0;"><strong>Nombre:</strong> ${data.visitorName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.visitorEmail}</p>
        ${data.visitorPhone ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${data.visitorPhone}</p>` : ''}
      </div>
      
      ${data.message ? `
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 16px;">💬 Mensaje del visitante</h3>
        <p style="margin: 0; background: #f0fdf4; padding: 10px; border-radius: 4px;">${data.message}</p>
      </div>
      ` : ''}
    </div>
    
    <div style="text-align: center; margin: 25px 0;">
      <a href="#" style="display: inline-block; background: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">✅ Confirmar</a>
      <a href="#" style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">❌ Rechazar</a>
    </div>
    
    <p style="text-align: center; color: #666; font-size: 14px;">
      También puedes gestionar esta solicitud desde el <strong>Panel de Administración</strong>
    </p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
TURISMO COMUNITARIO SOSTENIBLE
Nueva solicitud de reservación

Hola ${community.communityName},

¡Tienes una nueva solicitud de reservación! Un visitante desea conocer tu experiencia.

DETALLES DE LA SOLICITUD
------------------------
Experiencia: ${data.experienceName}
Fecha solicitada: ${formatDate(data.visitDate)}
Visitantes: ${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}

DATOS DEL VISITANTE
-------------------
Nombre: ${data.visitorName}
Email: ${data.visitorEmail}
${data.visitorPhone ? `Teléfono: ${data.visitorPhone}` : ''}

${data.message ? `MENSAJE DEL VISITANTE\n---------------------\n${data.message}` : ''}

Por favor, ingresa al Panel de Administración para confirmar o rechazar esta solicitud.

Equipo de Turismo Comunitario Sostenible
  `.trim();

  return { subject, htmlContent, textContent };
}

/**
 * Generate reminder email for upcoming visit
 */
export function generateVisitReminderEmail(
  data: ReservationEmailData,
  daysUntilVisit: number
): { subject: string; htmlContent: string; textContent: string } {
  const subject = `📅 Recordatorio: Tu visita a ${data.experienceName} es ${daysUntilVisit === 1 ? 'mañana' : `en ${daysUntilVisit} días`}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recordatorio de Visita</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px;">🌿 Turismo Comunitario Sostenible</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Recordatorio de tu próxima visita</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Hola <strong>${data.visitorName}</strong>,</p>
    
    <p>¡Tu aventura está por comenzar! Te recordamos que tu visita a <strong>${data.experienceName}</strong> es ${daysUntilVisit === 1 ? '<strong>mañana</strong>' : `en <strong>${daysUntilVisit} días</strong>`}.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #166534;">
      <h2 style="color: #166534; margin-top: 0; font-size: 18px;">📍 Detalles de tu visita</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666;">Experiencia:</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.experienceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Ubicación:</td>
          <td style="padding: 8px 0;">${data.experienceLocation}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Fecha:</td>
          <td style="padding: 8px 0; font-weight: bold;">${formatDate(data.visitDate)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;">Visitantes:</td>
          <td style="padding: 8px 0;">${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #065f46;">
        <strong>🎒 No olvides llevar:</strong><br>
        • Identificación oficial<br>
        • Ropa y calzado cómodo<br>
        • Protector solar y repelente<br>
        • Cámara fotográfica<br>
        • Agua y snacks
      </p>
    </div>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      ¡Disfruta tu experiencia!<br>
      <strong>Equipo de Turismo Comunitario Sostenible</strong>
    </p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
TURISMO COMUNITARIO SOSTENIBLE
Recordatorio de tu próxima visita

Hola ${data.visitorName},

¡Tu aventura está por comenzar! Te recordamos que tu visita a ${data.experienceName} es ${daysUntilVisit === 1 ? 'mañana' : `en ${daysUntilVisit} días`}.

DETALLES DE TU VISITA
---------------------
Experiencia: ${data.experienceName}
Ubicación: ${data.experienceLocation}
Fecha: ${formatDate(data.visitDate)}
Visitantes: ${getTotalVisitors(data.numberOfAdults, data.numberOfChildren)}

NO OLVIDES LLEVAR
-----------------
• Identificación oficial
• Ropa y calzado cómodo
• Protector solar y repelente
• Cámara fotográfica
• Agua y snacks

¡Disfruta tu experiencia!
Equipo de Turismo Comunitario Sostenible
  `.trim();

  return { subject, htmlContent, textContent };
}
