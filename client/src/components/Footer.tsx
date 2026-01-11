import { Link } from "wouter";
import { Leaf, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const quickLinks = [
  { href: "/geoportal", label: "Geoportal Interactivo" },
  { href: "/centro-contenido", label: "Centro de Contenido" },
  { href: "/campus-virtual", label: "Campus Virtual" },
  { href: "/distintivos", label: "Distintivos" },
  { href: "/galeria", label: "Galería de Experiencias" },
];

const institutionalLinks = [
  { href: "/acerca", label: "Acerca del Proyecto" },
  { href: "/contacto", label: "Contacto" },
  { href: "/verificar-certificado", label: "Verificar Certificado" },
  { href: "#", label: "Aviso de Privacidad" },
  { href: "#", label: "Términos de Uso" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-semibold text-background">Turismo</span>
                <span className="text-lg font-semibold text-primary"> Comunitario</span>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-4">
              Plataforma digital para fortalecer el turismo comunitario sostenible 
              en México, integrando criterios de conservación de la biodiversidad.
            </p>
            <div className="flex flex-col gap-2 text-sm text-background/70">
              <a href="mailto:contacto@turismocomunitario.mx" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                contacto@turismocomunitario.mx
              </a>
              <a href="tel:+525555555555" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +52 55 5555 5555
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ciudad de México, México
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-background">Explora</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-background">Información</h3>
            <ul className="space-y-2">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional Partners */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-background">Aliados Institucionales</h3>
            <div className="space-y-3">
              <a 
                href="https://www.gob.mx/sectur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors"
              >
                SECTUR <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://www.gob.mx/fonatur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors"
              >
                FONATUR <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://www.gob.mx/conanp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors"
              >
                CONANP <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://www.gob.mx/semarnat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 hover:text-primary transition-colors"
              >
                SEMARNAT <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-background/60">
            <p>
              © {new Date().getFullYear()} Plataforma de Turismo Comunitario Sostenible. 
              Todos los derechos reservados.
            </p>
            <p>
              Programa Nacional de Turismo Comunitario
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
