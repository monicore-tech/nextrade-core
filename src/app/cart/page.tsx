"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({totalItems} items)</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 items-center border rounded-lg p-4">
            <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-muted">
              <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.productId}`} className="font-medium hover:underline line-clamp-2 text-sm">
                {item.title}
              </Link>
              <p className="text-muted-foreground text-sm">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => item.quantity > 1 ? updateQty(item.productId, item.quantity - 1) : removeItem(item.productId)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateQty(item.productId, item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-right shrink-0 w-20">
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => removeItem(item.productId)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col items-end gap-3">
        <div className="flex justify-between w-full max-w-xs">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="w-full max-w-xs">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
        <Link href="/" className="w-full max-w-xs">
          <Button variant="outline" size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
