import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Award,
  CheckCircle2,
  FileCheck,
  Users,
  Leaf,
  Shield,
  Star,
  ArrowRight,
  Download,
  ClipboardCheck,
  BadgeCheck,
  Sprout,
  Trophy,
} from "lucide-react";

const badgeLevels = [
  {
    level: "semilla",
    name: "Distintivo Semilla",
    icon: Sprout,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/10",
    textColor: "text-green-600",
    description: "Nivel inicial para prestadores que inician su proceso de certificación en turismo comunitario sostenible.",
    requirements: [
      "Registro completo en la plataforma",
      "Documentación básica verificada",
      "Compromiso con prácticas sostenibles",
      "Capacitación introductoria completada",
    ],
  },
  {
    level: "excelencia",
    name: "Distintivo Excelencia",
    icon: Trophy,
    color: "from-amber-400 to-yellow-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-600",
    description: "Máximo reconocimiento para prestadores que demuestran excelencia en turismo comunitario y conservación.",
    requirements: [
      "Distintivo Semilla vigente",
      "Evaluación de sostenibilidad aprobada",
      "Certificaciones de capacitación avanzada",
      "Prácticas verificadas de conservación",
      "Impacto comunitario documentado",
    ],
  },
];

const processSteps = [
  {
    step: 1,
    title: "Registro",
    description: "Crea tu cuenta y completa el formulario de solicitud con la información de tu comunidad.",
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: "Documentación",
    description: "Sube los documentos requeridos: identificación, aval comunitario y verificadores.",
    icon: FileCheck,
  },
  {
    step: 3,
    title: "Evaluación",
    description: "Nuestro equipo revisa tu solicitud y verifica el cumplimiento de requisitos.",
    icon: Shield,
  },
  {
    step: 4,
    title: "Certificación",
    description: "Recibe tu distintivo y accede a beneficios exclusivos de la red.",
    icon: BadgeCheck,
  },
];

const benefits = [
  {
    icon: Star,
    title: "Visibilidad",
    description: "Aparece destacado en el geoportal y materiales promocionales",
  },
  {
    icon: Users,
    title: "Red de Contactos",
    description: "Conecta con otros prestadores y organizaciones aliadas",
  },
  {
    icon: Leaf,
    title: "Capacitación",
    description: "Acceso prioritario a cursos y talleres especializados",
  },
  {
    icon: Shield,
    title: "Respaldo",
    description: "Certificación respaldada por SECTUR y aliados institucionales",
  },
];

export default function Badges() {
  const { data: badges, isLoading } = trpc.badges.list.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Distintivos y Certificaciones"
        description="Conoce los distintivos de calidad y certificaciones para prestadores de servicios de turismo comunitario en México."
        keywords="distintivos turismo, certificaciones ecoturismo, calidad turismo comunitario, sello sustentable"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500/10 via-background to-primary/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              Sistema de Distintivos
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Distintivos para{" "}
              <span className="gradient-text">Prestadores de Servicios</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              Obtén el reconocimiento oficial como prestador de servicios turísticos 
              comunitarios comprometido con la sostenibilidad y la conservación.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/contacto">
                  Solicitar Distintivo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Descargar Lineamientos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Badge Levels */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Niveles de Certificación
            </h2>
            <p className="text-muted-foreground">
              El sistema de distintivos reconoce dos niveles de compromiso 
              con el turismo comunitario sostenible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {badgeLevels.map((badge) => (
              <Card key={badge.level} className="overflow-hidden hover-lift">
                <div className={`h-2 bg-gradient-to-r ${badge.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${badge.bgColor}`}>
                      <badge.icon className={`h-8 w-8 ${badge.textColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{badge.name}</CardTitle>
                      <Badge variant="secondary" className={badge.textColor}>
                        Nivel {badge.level === "semilla" ? "Inicial" : "Avanzado"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {badge.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm">Requisitos:</h4>
                    <ul className="space-y-2">
                      {badge.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${badge.textColor}`} />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Proceso de Obtención
            </h2>
            <p className="text-muted-foreground">
              Sigue estos pasos para obtener tu distintivo de prestador 
              de servicios turísticos comunitarios.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full hover-lift">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
                      {step.step}
                    </div>
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Beneficios del Distintivo
              </h2>
              <p className="text-muted-foreground mb-8">
                Al obtener tu distintivo, accedes a una serie de beneficios 
                que potenciarán tu proyecto de turismo comunitario.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="text-center">
                  <Award className="h-20 w-20 mx-auto text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Certificación Oficial
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Respaldada por la Secretaría de Turismo y aliados institucionales 
                    del Programa Nacional de Turismo Comunitario.
                  </p>
                  <Button asChild>
                    <Link href="/contacto">
                      Iniciar Proceso
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Current Badges from DB */}
      {badges && badges.length > 0 && (
        <section className="section-padding bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Distintivos Disponibles
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card key={badge.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {badge.iconUrl ? (
                        <img src={badge.iconUrl} alt={badge.name} className="w-12 h-12" />
                      ) : (
                        <div className={`p-3 rounded-xl ${
                          badge.level === "excelencia" 
                            ? "bg-amber-500/10 text-amber-600" 
                            : "bg-green-500/10 text-green-600"
                        }`}>
                          {badge.level === "excelencia" ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <Sprout className="h-6 w-6" />
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{badge.name}</h3>
                        <Badge variant="secondary">
                          {badge.level === "excelencia" ? "Excelencia" : "Semilla"}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {badge.description || "Distintivo de turismo comunitario sostenible"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para obtener tu distintivo?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Inicia el proceso de certificación y únete a la red de prestadores 
              de servicios turísticos comunitarios de México.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contacto">
                  Solicitar Distintivo
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/centro-contenido">
                  Ver Requisitos Completos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
