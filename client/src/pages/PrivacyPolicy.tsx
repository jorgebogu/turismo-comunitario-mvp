import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Eye, Lock, FileText, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Aviso de Privacidad
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Protegemos tu <span className="text-primary">Información Personal</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Conoce cómo recopilamos, usamos y protegemos tus datos personales en nuestra plataforma.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Last Updated */}
              <div className="bg-muted/50 rounded-lg p-4 mb-8 flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Última actualización: 10 de enero de 2026
                </p>
              </div>

              {/* Introduction */}
              <div className="prose prose-gray max-w-none mb-12">
                <p className="text-muted-foreground leading-relaxed">
                  La Plataforma de Turismo Comunitario Sostenible de México (en adelante "la Plataforma") 
                  está comprometida con la protección de la privacidad y los datos personales de sus usuarios. 
                  Este Aviso de Privacidad describe nuestras prácticas en relación con la información que 
                  recopilamos a través de nuestra plataforma web.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-10">
                {/* Section 1 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        1. Información que Recopilamos
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>Recopilamos los siguientes tipos de información:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Información de registro:</strong> Nombre, correo electrónico y datos de autenticación cuando creas una cuenta.</li>
                      <li><strong>Información de perfil:</strong> Datos adicionales que proporcionas voluntariamente, como organización o comunidad.</li>
                      <li><strong>Información de uso:</strong> Datos sobre cómo interactúas con la plataforma, incluyendo cursos tomados y experiencias visitadas.</li>
                      <li><strong>Información de reservaciones:</strong> Detalles de las reservaciones que realizas, incluyendo fechas, número de visitantes y preferencias.</li>
                      <li><strong>Información de contacto:</strong> Mensajes enviados a través de nuestro formulario de contacto.</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        2. Uso de la Información
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>Utilizamos la información recopilada para:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Proporcionar y mejorar nuestros servicios de turismo comunitario</li>
                      <li>Procesar reservaciones y solicitudes de información</li>
                      <li>Emitir certificados de capacitación del Campus Virtual</li>
                      <li>Enviar notificaciones relacionadas con tus reservaciones y cursos</li>
                      <li>Comunicar actualizaciones importantes sobre la plataforma</li>
                      <li>Realizar análisis estadísticos para mejorar la experiencia del usuario</li>
                      <li>Cumplir con obligaciones legales y regulatorias</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        3. Protección de Datos
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para 
                      proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                    </p>
                    <p>Estas medidas incluyen:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Encriptación de datos en tránsito y en reposo</li>
                      <li>Autenticación segura mediante OAuth</li>
                      <li>Acceso restringido a información personal solo a personal autorizado</li>
                      <li>Monitoreo continuo de seguridad</li>
                      <li>Copias de seguridad regulares</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        4. Tus Derechos ARCO
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      De acuerdo con la Ley Federal de Protección de Datos Personales en Posesión de los 
                      Particulares, tienes derecho a:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre ti</li>
                      <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos</li>
                      <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos personales</li>
                      <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para fines específicos</li>
                    </ul>
                    <p className="mt-4">
                      Para ejercer estos derechos, puedes contactarnos a través de nuestro formulario de 
                      contacto o enviando un correo electrónico a la dirección indicada al final de este documento.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        5. Contacto
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Si tienes preguntas sobre este Aviso de Privacidad o sobre el tratamiento de tus datos 
                      personales, puedes contactarnos:
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p><strong>Correo electrónico:</strong> contacto@turismocomunitario.mx</p>
                      <p><strong>Teléfono:</strong> +52 55 5555 5555</p>
                      <p><strong>Dirección:</strong> Ciudad de México, México</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-muted-foreground text-center">
                  Este Aviso de Privacidad puede ser actualizado periódicamente. Te recomendamos revisarlo 
                  regularmente para estar informado sobre cómo protegemos tu información. El uso continuado 
                  de la plataforma después de cualquier modificación constituye tu aceptación de dichos cambios.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
