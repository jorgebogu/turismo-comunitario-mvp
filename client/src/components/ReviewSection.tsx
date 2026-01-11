import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { StarRating, RatingDistribution } from "@/components/StarRating";
import { toast } from "sonner";
import {
  MessageSquare,
  ThumbsUp,
  Trash2,
  Calendar,
  User,
  Loader2,
  LogIn,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ReviewSectionProps {
  experienceId: number;
  experienceName: string;
}

export function ReviewSection({ experienceId, experienceName }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const utils = trpc.useUtils();

  const { data: reviews, isLoading: loadingReviews } = trpc.reviews.getByExperience.useQuery({
    experienceId,
  });

  const { data: stats, isLoading: loadingStats } = trpc.reviews.getStats.useQuery({
    experienceId,
  });

  const { data: userReview } = trpc.reviews.getUserReview.useQuery(
    { experienceId },
    { enabled: isAuthenticated }
  );

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("¡Gracias por tu reseña!");
      setShowForm(false);
      setRating(0);
      setTitle("");
      setComment("");
      utils.reviews.getByExperience.invalidate({ experienceId });
      utils.reviews.getStats.invalidate({ experienceId });
      utils.reviews.getUserReview.invalidate({ experienceId });
    },
    onError: (error) => {
      toast.error(error.message || "Error al publicar la reseña");
    },
  });

  const deleteReview = trpc.reviews.delete.useMutation({
    onSuccess: () => {
      toast.success("Reseña eliminada");
      utils.reviews.getByExperience.invalidate({ experienceId });
      utils.reviews.getStats.invalidate({ experienceId });
      utils.reviews.getUserReview.invalidate({ experienceId });
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar la reseña");
    },
  });

  const markHelpful = trpc.reviews.markHelpful.useMutation({
    onSuccess: () => {
      utils.reviews.getByExperience.invalidate({ experienceId });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }
    createReview.mutate({
      experienceId,
      rating,
      title: title || undefined,
      comment: comment || undefined,
    });
  };

  const averageRating = stats?.averageRating || 0;
  const totalReviews = stats?.totalReviews || 0;

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Reseñas y Calificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-4xl font-bold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
                <div>
                  <StarRating rating={averageRating} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {totalReviews > 0 && (
              <RatingDistribution
                distribution={stats?.ratingDistribution || {}}
                totalReviews={totalReviews}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Write Review Section */}
      {!userReview && (
        <Card>
          <CardContent className="pt-6">
            {!isAuthenticated ? (
              <div className="text-center py-4">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">
                  Inicia sesión para dejar tu reseña
                </p>
                <Button asChild>
                  <a href={getLoginUrl()}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </a>
                </Button>
              </div>
            ) : !showForm ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  ¿Has visitado {experienceName}? ¡Comparte tu experiencia!
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Escribir Reseña
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Tu calificación *</Label>
                  <div className="mt-2">
                    <StarRating
                      rating={rating}
                      size="lg"
                      interactive
                      onRatingChange={setRating}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="review-title">Título de tu reseña (opcional)</Label>
                  <Input
                    id="review-title"
                    placeholder="Resume tu experiencia en una frase"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                  />
                </div>

                <div>
                  <Label htmlFor="review-comment">Tu comentario (opcional)</Label>
                  <Textarea
                    id="review-comment"
                    placeholder="Cuéntanos más sobre tu visita..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createReview.isPending || rating === 0}
                  >
                    {createReview.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Publicar Reseña
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setRating(0);
                      setTitle("");
                      setComment("");
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* User's Own Review */}
      {userReview && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Tu reseña</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  if (confirm("¿Estás seguro de eliminar tu reseña?")) {
                    deleteReview.mutate({ reviewId: userReview.id });
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <StarRating rating={userReview.rating} size="md" />
            {userReview.title && (
              <h4 className="font-medium mt-2">{userReview.title}</h4>
            )}
            {userReview.comment && (
              <p className="text-muted-foreground mt-1">{userReview.comment}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {loadingReviews ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">
            Todas las reseñas ({reviews.length})
          </h3>
          {reviews
            .filter((r) => r.review.userId !== user?.id)
            .map(({ review, userName }) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <span className="font-medium">
                            {userName || "Usuario"}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size="sm" />
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                                locale: es,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {review.title && (
                        <h4 className="font-medium mt-2">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {review.comment}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground h-8 px-2"
                          onClick={() => markHelpful.mutate({ reviewId: review.id })}
                        >
                          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                          Útil ({review.helpfulCount || 0})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              Aún no hay reseñas para esta experiencia.
              <br />
              ¡Sé el primero en compartir tu opinión!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
