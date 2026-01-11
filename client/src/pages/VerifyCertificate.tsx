import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  Award,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  GraduationCap,
  User,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function VerifyCertificate() {
  const [code, setCode] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const { data: result, isLoading, isError } = trpc.certificates.verify.useQuery(
    { code: searchCode },
    { enabled: searchCode.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCode(code.trim().toUpperCase());
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const levelLabels: Record<string, string> = {
    basico: "Nivel Básico",
    intermedio: "Nivel Intermedio",
    avanzado: "Nivel Avanzado",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <ShieldCheck className="h-4 w-4" />
              Verificación de Certificados
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Verifica la Autenticidad de un{" "}
              <span className="gradient-text">Certificado</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Ingresa el código de verificación que aparece en el certificado
              para confirmar su autenticidad.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Ej: TCS-M5K2J8-ABCD1234"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center font-mono"
              />
              <Button type="submit" disabled={!code.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {searchCode && (
              <>
                {isLoading ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                      <p className="text-muted-foreground">Verificando certificado...</p>
                    </CardContent>
                  </Card>
                ) : result?.valid ? (
                  <Card className="border-green-500/50 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-green-500/10">
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-green-700">
                            Certificado Válido
                          </CardTitle>
                          <p className="text-sm text-green-600">
                            Este certificado es auténtico y está vigente
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4">
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Otorgado a</p>
                            <p className="font-semibold text-foreground">
                              {result.certificate?.userName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                          <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Curso completado</p>
                            <p className="font-semibold text-foreground">
                              {result.certificate?.courseTitle}
                            </p>
                            {result.certificate?.courseLevel && (
                              <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                {levelLabels[result.certificate.courseLevel] || result.certificate.courseLevel}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Fecha de emisión</p>
                            <p className="font-semibold text-foreground">
                              {result.certificate?.issuedAt && formatDate(result.certificate.issuedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                          <Award className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Código de verificación</p>
                            <p className="font-mono font-semibold text-foreground">
                              {result.certificate?.certificateCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-red-500/50 bg-red-50/50">
                    <CardContent className="py-12 text-center">
                      <div className="p-4 rounded-full bg-red-500/10 w-fit mx-auto mb-4">
                        <XCircle className="h-12 w-12 text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-red-700 mb-2">
                        Certificado No Válido
                      </h3>
                      <p className="text-red-600">
                        {result?.message || "No se encontró un certificado con este código"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-4">
                        Verifica que el código esté escrito correctamente o contacta
                        con soporte si crees que es un error.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!searchCode && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Ingresa un código de verificación
                  </h3>
                  <p className="text-muted-foreground">
                    El código se encuentra en la parte inferior del certificado
                    con el formato TCS-XXXXX-XXXXXXXX
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <div className="flex-grow" />
      <Footer />
    </div>
  );
}
