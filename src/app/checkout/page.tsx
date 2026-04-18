"use client";

import { useState, type FormEvent } from "react";
import { useCart } from "@/contexts/cart-context";
import { placeOrder } from "@/lib/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground">Your cart is empty</p>
        <Link href="/"><Button>Go Shopping</Button></Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const address = form.get("address") as string;

    const orderItems = items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      priceCents: Math.round(i.price * 100),
    }));

    const totalCents = Math.round(totalPrice * 100);

    try {
      await placeOrder({ address, items: orderItems, totalCents });
      clearCart();
    } catch {
      toast.error("Failed to place order. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="address">Delivery Address</Label>
            <Input id="address" name="address" required minLength={5} placeholder="123 Main St, City, Country" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Place Order — ${totalPrice.toFixed(2)}
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="truncate mr-2">{item.title} ×{item.quantity}</span>
              <span className="shrink-0 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
