"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
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
    <Card className="flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-500">
            -{product.discountPercentage}%
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-background text-xs">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-semibold text-muted-foreground">Out of stock</span>
          </div>
        )}
      </Link>

      <CardContent className="flex-1 p-3">
        <p className="text-xs text-muted-foreground capitalize mb-1">{product.category}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold">${discountedPrice.toFixed(2)}</p>
          {product.discountPercentage > 0 && (
            <p className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</p>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="shrink-0"
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
