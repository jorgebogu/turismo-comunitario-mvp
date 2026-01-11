import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Award, Download, Eye, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CertificateViewerProps {
  enrollmentId: number;
  courseTitle: string;
  isCompleted: boolean;
}

export default function CertificateViewer({
  enrollmentId,
  courseTitle,
  isCompleted,
}: CertificateViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [certificateHtml, setCertificateHtml] = useState<string | null>(null);

  const generateMutation = trpc.certificates.generate.useMutation({
    onSuccess: (data) => {
      if (data.alreadyExists) {
        toast.info("Ya tienes un certificado para este curso");
      } else {
        toast.success("¡Certificado generado exitosamente!");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: existingCertificate, refetch: refetchCertificate } = 
    trpc.certificates.getByEnrollment.useQuery(
      { enrollmentId },
      { enabled: isCompleted }
    );

  const { refetch: fetchHtml, isFetching: isFetchingHtml } = 
    trpc.certificates.getHtml.useQuery(
      { enrollmentId },
      { 
        enabled: false,
        retry: false,
      }
    );

  const handleGenerateCertificate = async () => {
    await generateMutation.mutateAsync({ enrollmentId });
    refetchCertificate();
  };

  const handleViewCertificate = async () => {
    const result = await fetchHtml();
    if (result.data?.html) {
      setCertificateHtml(result.data.html);
      setIsOpen(true);
    }
  };

  const handleDownloadPdf = async () => {
    const result = await fetchHtml();
    if (result.data?.html) {
      // Abrir en nueva ventana para imprimir/guardar como PDF
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(result.data.html);
        printWindow.document.close();
        // Agregar botón de impresión
        const printButton = printWindow.document.createElement("button");
        printButton.innerHTML = "Guardar como PDF (Ctrl+P)";
        printButton.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          background: #1a5f2a;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        printButton.onclick = () => printWindow.print();
        printWindow.document.body.appendChild(printButton);
      }
    }
  };

  if (!isCompleted) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Award className="h-4 w-4" />
        <span>Completa el curso al 100% para obtener tu certificado</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {existingCertificate ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Certificado disponible</span>
          </div>
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewCertificate}
                  disabled={isFetchingHtml}
                >
                  {isFetchingHtml ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  Ver Certificado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Certificado - {courseTitle}</DialogTitle>
                </DialogHeader>
                {certificateHtml && (
                  <div 
                    className="mt-4 border rounded-lg overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: certificateHtml }}
                  />
                )}
                <div className="flex justify-end gap-2 mt-4">
                  <Button onClick={handleDownloadPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isFetchingHtml}
            >
              {isFetchingHtml ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Descargar PDF
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleGenerateCertificate}
          disabled={generateMutation.isPending}
          className="bg-gradient-to-r from-primary to-green-600"
        >
          {generateMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Award className="h-4 w-4 mr-2" />
          )}
          Generar Certificado
        </Button>
      )}
      
      {existingCertificate && (
        <p className="text-xs text-muted-foreground">
          Código de verificación: <code className="bg-muted px-1 py-0.5 rounded">{existingCertificate.certificateCode}</code>
        </p>
      )}
    </div>
  );
}
