import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ScrollText, Users, AlertTriangle, Scale, FileCheck, Mail } from "lucide-react";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <ScrollText className="h-4 w-4" />
                Términos de Uso
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Términos y <span className="text-primary">Condiciones de Uso</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Lee atentamente los términos que rigen el uso de nuestra plataforma de turismo comunitario sostenible.
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
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Última actualización: 10 de enero de 2026
                </p>
              </div>

              {/* Introduction */}
              <div className="prose prose-gray max-w-none mb-12">
                <p className="text-muted-foreground leading-relaxed">
                  Bienvenido a la Plataforma de Turismo Comunitario Sostenible de México. Al acceder y utilizar 
                  esta plataforma, aceptas cumplir con estos Términos de Uso. Si no estás de acuerdo con alguna 
                  parte de estos términos, te pedimos que no utilices nuestros servicios.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-10">
                {/* Section 1 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <ScrollText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        1. Aceptación de los Términos
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Al acceder o utilizar la Plataforma de Turismo Comunitario Sostenible, confirmas que:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Tienes al menos 18 años de edad o cuentas con el consentimiento de un tutor legal</li>
                      <li>Tienes la capacidad legal para celebrar un acuerdo vinculante</li>
                      <li>No estás impedido de utilizar los servicios bajo las leyes aplicables</li>
                      <li>Utilizarás la plataforma de manera responsable y conforme a estos términos</li>
                    </ul>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        2. Uso de la Plataforma
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      La plataforma está diseñada para facilitar la conexión entre viajeros y comunidades 
                      que ofrecen experiencias de turismo sostenible. Al utilizar nuestros servicios, te comprometes a:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Proporcionar información veraz y actualizada en tu registro y reservaciones</li>
                      <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                      <li>No utilizar la plataforma para fines ilegales o no autorizados</li>
                      <li>Respetar los derechos de propiedad intelectual de la plataforma y terceros</li>
                      <li>No interferir con el funcionamiento normal de la plataforma</li>
                      <li>Respetar a las comunidades y sus tradiciones durante las visitas</li>
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FileCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        3. Reservaciones y Servicios
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Las reservaciones realizadas a través de la plataforma están sujetas a las siguientes condiciones:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Las reservaciones están sujetas a disponibilidad y confirmación por parte de la comunidad</li>
                      <li>Los precios y condiciones son establecidos por cada comunidad prestadora de servicios</li>
                      <li>Las políticas de cancelación varían según cada experiencia</li>
                      <li>La plataforma actúa como intermediario y no es responsable directa de los servicios prestados</li>
                      <li>Es responsabilidad del usuario verificar los requisitos específicos de cada experiencia</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Scale className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        4. Propiedad Intelectual
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Todo el contenido de la plataforma, incluyendo pero no limitado a:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Textos, gráficos, logotipos e imágenes</li>
                      <li>Diseño y estructura de la plataforma</li>
                      <li>Materiales educativos del Campus Virtual</li>
                      <li>Certificados y distintivos</li>
                    </ul>
                    <p className="mt-4">
                      Están protegidos por derechos de autor y otras leyes de propiedad intelectual. 
                      No está permitida la reproducción, distribución o modificación sin autorización expresa.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        5. Limitación de Responsabilidad
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      La plataforma se proporciona "tal cual" y "según disponibilidad". En la medida 
                      permitida por la ley:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>No garantizamos que la plataforma esté libre de errores o interrupciones</li>
                      <li>No somos responsables por daños indirectos, incidentales o consecuentes</li>
                      <li>No garantizamos la exactitud de la información proporcionada por terceros</li>
                      <li>Los usuarios asumen el riesgo de las actividades realizadas durante las experiencias turísticas</li>
                    </ul>
                    <p className="mt-4">
                      Recomendamos a los usuarios contratar seguros de viaje apropiados para sus actividades.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div className="bg-card rounded-xl border p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        6. Contacto y Resolución de Disputas
                      </h2>
                    </div>
                  </div>
                  <div className="ml-14 space-y-4 text-muted-foreground">
                    <p>
                      Para cualquier pregunta, queja o disputa relacionada con estos términos o el uso 
                      de la plataforma, puedes contactarnos:
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 mt-4">
                      <p><strong>Correo electrónico:</strong> contacto@turismocomunitario.mx</p>
                      <p><strong>Teléfono:</strong> +52 55 5555 5555</p>
                      <p><strong>Dirección:</strong> Ciudad de México, México</p>
                    </div>
                    <p className="mt-4">
                      Cualquier disputa será resuelta de acuerdo con las leyes de los Estados Unidos Mexicanos, 
                      sometiéndose las partes a la jurisdicción de los tribunales competentes de la Ciudad de México.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-muted-foreground text-center">
                  Nos reservamos el derecho de modificar estos Términos de Uso en cualquier momento. 
                  Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. 
                  El uso continuado de los servicios después de cualquier cambio constituye tu aceptación de los 
                  nuevos términos.
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
