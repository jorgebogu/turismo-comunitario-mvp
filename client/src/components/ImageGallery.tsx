import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: number;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
  altText?: string | null;
  isPrimary?: boolean;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  fallbackImage?: string;
  experienceName: string;
  className?: string;
}

export default function ImageGallery({ 
  images, 
  fallbackImage, 
  experienceName,
  className 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sort images by displayOrder, with primary first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  // If no images, use fallback
  const displayImages = sortedImages.length > 0 
    ? sortedImages 
    : fallbackImage 
      ? [{ id: 0, imageUrl: fallbackImage, altText: experienceName }] 
      : [];

  const hasMultipleImages = displayImages.length > 1;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrevious();
        if (e.key === "Escape") setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToNext, goToPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  if (displayImages.length === 0) {
    return (
      <div className={cn("aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <ZoomIn className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  const currentImage = displayImages[currentIndex];

  return (
    <>
      {/* Main Gallery */}
      <div className={cn("relative group", className)}>
        {/* Main Image */}
        <div 
          className="aspect-video rounded-xl overflow-hidden bg-muted cursor-pointer relative"
          onClick={() => setIsLightboxOpen(true)}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={currentImage.imageUrl}
            alt={currentImage.altText || currentImage.title || experienceName}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          
          {/* Zoom overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                <Maximize2 className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </div>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Thumbnail Strip */}
        {hasMultipleImages && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToIndex(index)}
                className={cn(
                  "flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                  index === currentIndex 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <img
                  src={image.imageUrl}
                  alt={image.altText || `Imagen ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Title/Description */}
        {(currentImage.title || currentImage.description) && (
          <div className="mt-2 text-sm">
            {currentImage.title && (
              <p className="font-medium text-foreground">{currentImage.title}</p>
            )}
            {currentImage.description && (
              <p className="text-muted-foreground">{currentImage.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 left-4 text-white text-sm">
              {currentIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Main lightbox image */}
          <div 
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.altText || currentImage.title || experienceName}
              className="max-w-full max-h-[85vh] object-contain"
            />

            {/* Caption */}
            {(currentImage.title || currentImage.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                {currentImage.title && (
                  <p className="font-medium">{currentImage.title}</p>
                )}
                {currentImage.description && (
                  <p className="text-sm text-white/80">{currentImage.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Thumbnail strip in lightbox */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-lg max-w-[90vw] overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(index);
                  }}
                  className={cn(
                    "flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                    index === currentIndex 
                      ? "border-white" 
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || `Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
