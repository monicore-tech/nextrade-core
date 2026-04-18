"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Image from "next/image";
import { Star, Package, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProductReviews } from "@/components/product-reviews";
import type { Product } from "@/lib/dummyApi";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const { addItem } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="text-center py-16">Product not found.</div>;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      quantity: 1,
      title: product.title,
      price: discountedPrice,
      thumbnail: product.thumbnail,
    });
    toast.success(`${product.title} added to cart`);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={product.images[imgIndex] ?? product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => Math.max(0, i - 1))}
                  disabled={imgIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => Math.min(product.images.length - 1, i + 1))}
                  disabled={imgIndex === product.images.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-1 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`shrink-0 relative w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                  i === imgIndex ? "border-primary" : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            <h1 className="text-2xl font-bold mt-1">{product.title}</h1>
            {product.brand && <p className="text-sm text-muted-foreground">by {product.brand}</p>}
          </div>

          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)}</span>
          </div>

          <Separator />

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${discountedPrice.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500 hover:bg-red-500">-{product.discountPercentage}%</Badge>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" />
            {product.stock > 10 ? (
              <span className="text-green-600">In stock ({product.stock} available)</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600">Only {product.stock} left!</span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Separator />

          <div>
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <ProductReviews productId={product.id} isLoggedIn={!!session} />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
