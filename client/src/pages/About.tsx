import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  Target,
  Users,
  Globe,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle2,
  Building,
  Handshake,
  TreePine,
  Bird,
  Mountain,
  Waves,
} from "lucide-react";

const objectives = [
  {
    icon: Globe,
    title: "Ecosistema Digital",
    description: "Consolidar un ecosistema digital que impulse el turismo sostenible en México, facilitando la articulación entre comunidades, instituciones y turistas.",
  },
  {
    icon: Users,
    title: "Conexión Viajeros-Comunidades",
    description: "Conectar a viajeros interesados en experiencias auténticas con prestadores de servicios comunitarios comprometidos con la sostenibilidad.",
  },
  {
    icon: Shield,
    title: "Conservación de Biodiversidad",
    description: "Integrar criterios de conservación de la biodiversidad en todas las experiencias turísticas comunitarias.",
  },
  {
    icon: Heart,
    title: "Beneficio Comunitario",
    description: "Generar beneficios económicos y sociales para las comunidades locales a través del turismo responsable.",
  },
];

const modules = [
  { name: "Geoportal Interactivo", description: "Mapa de experiencias turísticas comunitarias" },
  { name: "Centro de Contenido", description: "Recursos educativos y guías" },
  { name: "Campus Virtual", description: "Capacitación y formación continua" },
  { name: "Sistema de Distintivos", description: "Certificación de prestadores" },
  { name: "Galería de Experiencias", description: "Visualización de destinos" },
  { name: "Caja de Herramientas", description: "Normatividad y procedimientos" },
];

const partners = [
  { name: "SECTUR", description: "Secretaría de Turismo" },
  { name: "FONATUR", description: "Fondo Nacional de Fomento al Turismo" },
  { name: "CONANP", description: "Comisión Nacional de Áreas Naturales Protegidas" },
  { name: "SEMARNAT", description: "Secretaría de Medio Ambiente" },
];

const biodiversityFacts = [
  { icon: TreePine, label: "Ecosistemas", value: "51 tipos" },
  { icon: Bird, label: "Especies de Aves", value: "1,100+" },
  { icon: Mountain, label: "Áreas Protegidas", value: "182" },
  { icon: Waves, label: "Km de Costa", value: "11,122" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Acerca del Proyecto"
        description="Conoce la misión, visión y objetivos de la plataforma de Turismo Comunitario Sostenible en México."
        keywords="acerca de, misión turismo comunitario, proyecto ecoturismo México, turismo sostenible"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              Acerca del Proyecto
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Plataforma de{" "}
              <span className="gradient-text">Turismo Comunitario Sostenible</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Una iniciativa para fortalecer el turismo comunitario en México, 
              integrando criterios de conservación de la biodiversidad y 
              contribuyendo al desarrollo sostenible de las comunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Nuestra Misión
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Diseñar y operar una plataforma web responsiva que permita fortalecer 
                la implementación de un turismo comunitario sostenible que integre 
                criterios de conservación de la biodiversidad.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Buscamos consolidar un ecosistema digital que impulse el turismo 
                sostenible en México, facilitando la articulación entre comunidades, 
                instituciones gubernamentales, organizaciones aliadas y turistas.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/geoportal">
                    Explorar Experiencias
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contacto">
                    Contactar
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {biodiversityFacts.map((fact, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-6 text-center">
                      <fact.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold text-foreground">{fact.value}</div>
                      <div className="text-sm text-muted-foreground">{fact.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Objetivos del Proyecto
            </h2>
            <p className="text-muted-foreground text-lg">
              Trabajamos para crear un impacto positivo en las comunidades 
              y el medio ambiente a través del turismo responsable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <obj.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{obj.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {obj.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Módulos de la Plataforma
            </h2>
            <p className="text-muted-foreground text-lg">
              Una suite completa de herramientas para el turismo comunitario sostenible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Biodiversity Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                México: País Megadiverso
              </h2>
              <p className="text-muted-foreground text-lg">
                Somos uno de los 17 países megadiversos del mundo, hogar del 
                10-12% de la biodiversidad global.
              </p>
            </div>

            <Card className="p-8">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="leading-relaxed">
                  México ocupa un lugar privilegiado en términos de biodiversidad. 
                  Nuestro territorio alberga una extraordinaria variedad de ecosistemas, 
                  desde selvas tropicales hasta desiertos, pasando por bosques templados, 
                  manglares y arrecifes de coral.
                </p>
                <p className="leading-relaxed">
                  Esta riqueza natural representa tanto una responsabilidad como una 
                  oportunidad. El turismo comunitario sostenible permite que las 
                  comunidades locales se conviertan en guardianes de estos ecosistemas, 
                  generando beneficios económicos mientras protegen el patrimonio natural.
                </p>
                <p className="leading-relaxed mb-0">
                  Nuestra plataforma integra criterios de conservación de la biodiversidad 
                  en cada experiencia turística, asegurando que cada visita contribuya 
                  a la protección de nuestros recursos naturales.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Aliados Institucionales
            </h2>
            <p className="text-muted-foreground text-lg">
              Trabajamos en colaboración con instituciones gubernamentales 
              y organizaciones comprometidas con el turismo sostenible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nuestros Valores
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover-lift">
                <CardContent className="p-6">
                  <Leaf className="h-10 w-10 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Sostenibilidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Promovemos prácticas que protegen el medio ambiente para 
                    las generaciones futuras.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover-lift">
                <CardContent className="p-6">
                  <Handshake className="h-10 w-10 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Comunidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Las comunidades locales son el centro de nuestra misión 
                    y los principales beneficiarios.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center hover-lift">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Autenticidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Valoramos y preservamos las tradiciones y culturas 
                    de las comunidades mexicanas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Únete al Movimiento
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Ya sea como viajero, comunidad o aliado institucional, 
              tu participación es fundamental para construir un turismo 
              más sostenible y responsable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/geoportal">
                  Explorar Experiencias
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/contacto">
                  Registrar mi Comunidad
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
