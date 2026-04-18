"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product } from "@/lib/dummyApi";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  function handleAddToCart() {
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
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-xl"
    >
      <Card className="flex flex-col overflow-hidden h-full border border-border/60 rounded-xl">
        <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          {product.discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500 text-xs font-semibold">
              -{Math.round(product.discountPercentage)}%
            </Badge>
          )}
          {product.stock > 0 && product.stock < 10 && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-background/90 text-xs">
              Only {product.stock} left
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
              <span className="font-semibold text-sm text-muted-foreground">Out of stock</span>
            </div>
          )}
        </Link>

        <CardContent className="flex-1 p-3">
          <p className="text-xs text-muted-foreground capitalize mb-1 tracking-wide">{product.category}</p>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-0.5">{product.rating.toFixed(1)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex items-center justify-between gap-2">
          <div>
            <p className="font-bold text-base">${discountedPrice.toFixed(2)}</p>
            {product.discountPercentage > 0 && (
              <p className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</p>
            )}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
