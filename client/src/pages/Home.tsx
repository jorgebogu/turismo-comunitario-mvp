import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import {
  Leaf,
  Map,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  ArrowRight,
  TreePine,
  Bird,
  Mountain,
  Waves,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Geoportal Interactivo",
    description: "Explora experiencias turísticas comunitarias en un mapa interactivo de México.",
    href: "/geoportal",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Centro de Contenido",
    description: "Accede a guías, manuales y recursos sobre turismo sostenible y biodiversidad.",
    href: "/centro-contenido",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: GraduationCap,
    title: "Campus Virtual",
    description: "Capacítate con cursos especializados en turismo comunitario y conservación.",
    href: "/campus-virtual",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Award,
    title: "Distintivos",
    description: "Conoce las certificaciones para prestadores de servicios turísticos comunitarios.",
    href: "/distintivos",
    color: "bg-purple-500/10 text-purple-600",
  },
];

const ecosystems = [
  { icon: TreePine, name: "Bosques", count: "45+" },
  { icon: Bird, name: "Aves", count: "1,100+" },
  { icon: Mountain, name: "Montañas", count: "32" },
  { icon: Waves, name: "Costas", count: "28" },
];

export default function Home() {
  const { data: stats } = trpc.stats.get.useQuery();
  const { data: featuredExperiences } = trpc.experiences.getFeatured.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2322c55e%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container relative">
          <div className="py-20 md:py-32 lg:py-40">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                Turismo Sostenible en México
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Descubre el{" "}
                <span className="gradient-text">Turismo Comunitario</span>{" "}
                que Conserva la Biodiversidad
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                Conectamos viajeros con experiencias auténticas en comunidades mexicanas 
                que protegen y celebran nuestra riqueza natural y cultural.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base">
                  <Link href="/geoportal">
                    Explorar Experiencias
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link href="/acerca">
                    Conocer el Proyecto
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats?.experiences || 0}+</div>
              <div className="text-primary-foreground/80 text-sm">Experiencias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">32</div>
              <div className="text-primary-foreground/80 text-sm">Estados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats?.courses || 0}+</div>
              <div className="text-primary-foreground/80 text-sm">Cursos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1">{stats?.resources || 0}+</div>
              <div className="text-primary-foreground/80 text-sm">Recursos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Una Plataforma Integral
            </h2>
            <p className="text-muted-foreground text-lg">
              Herramientas diseñadas para conectar, capacitar y certificar 
              a las comunidades en turismo sostenible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <Card className="h-full hover-lift cursor-pointer border-border/50 hover:border-primary/30 transition-all">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium mt-4">
                      Explorar <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Biodiversity Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Conservación de la{" "}
                <span className="gradient-text">Biodiversidad</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                México es uno de los 17 países megadiversos del mundo. Nuestro programa 
                integra criterios de conservación en cada experiencia turística, 
                protegiendo ecosistemas únicos mientras generamos beneficios para 
                las comunidades locales.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Desde los bosques de niebla de Oaxaca hasta los arrecifes del Caribe, 
                cada experiencia contribuye a la preservación de nuestro patrimonio natural.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {ecosystems.map((eco) => (
                  <div key={eco.name} className="text-center p-4 rounded-xl bg-background/80 backdrop-blur">
                    <eco.icon className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-foreground">{eco.count}</div>
                    <div className="text-sm text-muted-foreground">{eco.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Leaf className="h-24 w-24 mx-auto text-primary mb-4" />
                  <p className="text-lg font-medium text-foreground">
                    Turismo que Protege
                  </p>
                  <p className="text-muted-foreground">
                    Cada visita apoya la conservación
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      {featuredExperiences && featuredExperiences.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Experiencias Destacadas
                </h2>
                <p className="text-muted-foreground">
                  Descubre algunas de las experiencias más populares
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/galeria">
                  Ver Todas <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredExperiences.map((exp) => (
                <Link key={exp.id} href={`/experiencia/${exp.id}`}>
                  <Card className="overflow-hidden hover-lift cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      {exp.imageUrl ? (
                        <img 
                          src={exp.imageUrl} 
                          alt={exp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mountain className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur text-xs font-medium text-foreground">
                          {exp.state}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {exp.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {exp.shortDescription || exp.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="h-12 w-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Eres parte de una comunidad turística?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              Únete a nuestra red de prestadores de servicios turísticos comunitarios. 
              Obtén capacitación, certificaciones y visibilidad para tu proyecto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link href="/contacto">
                  Registrar mi Comunidad
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/distintivos">
                  Conocer Distintivos
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
