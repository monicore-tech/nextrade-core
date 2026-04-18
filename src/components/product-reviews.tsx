"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: number;
  rating: number;
  body: string;
  createdAt: string;
  userId: number;
}

interface ProductReviewsProps {
  productId: number;
  isLoggedIn: boolean;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId, isLoggedIn }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); });
  }, [productId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (body.trim().length < 5) { toast.error("Review must be at least 5 characters"); return; }

    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, body: body.trim() }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Failed to submit review");
      return;
    }

    const newReview = await res.json();
    setReviews((prev) => [newReview, ...prev]);
    setRating(0);
    setBody("");
    toast.success("Review submitted!");
  }

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mt-12">
      <Separator className="mb-8" />
      <div className="flex items-baseline gap-4 mb-6">
        <h2 className="font-heading text-xl font-bold">Customer Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{avgRating.toFixed(1)}</span>
            <span>({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-xl border bg-muted/30 space-y-3">
          <p className="font-medium text-sm">Write a review</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your experience with this product…"
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{body.length}/500</span>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">No reviews yet. {isLoggedIn ? "Be the first!" : "Sign in to leave one."}</p>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl border bg-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{review.body}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
