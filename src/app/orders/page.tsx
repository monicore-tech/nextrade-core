import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { OrderItem } from "@/lib/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, Number(session.user.id)))
    .orderBy(desc(orders.createdAt));

  if (userOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Package className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-xl font-semibold">No orders yet</h1>
        <p className="text-muted-foreground text-sm">Your completed orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {userOrders.map((order) => {
          const items = order.items as OrderItem[];
          return (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Order #{order.id}</CardTitle>
                  <Badge variant={order.status === "confirmed" ? "default" : "secondary"} className="capitalize">
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Product #{item.productId} ×{item.quantity}</span>
                    <span>${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${(order.totalCents / 100).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
