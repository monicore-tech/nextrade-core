"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, carts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const CheckoutSchema = z.object({
  address: z.string().min(5),
  items: z.array(
    z.object({
      productId: z.number().int(),
      quantity: z.number().int().min(1),
      priceCents: z.number().int().min(0),
    })
  ).min(1),
  totalCents: z.number().int().min(1),
});

export async function placeOrder(data: unknown) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const parsed = CheckoutSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid order data" };
  }

  const userId = Number(session.user.id);
  const { items, totalCents } = parsed.data;

  const [order] = await db
    .insert(orders)
    .values({ userId, items, totalCents, status: "confirmed" })
    .returning({ id: orders.id });

  await db.delete(carts).where(eq(carts.userId, userId));

  redirect(`/checkout/confirmation?orderId=${order.id}`);
}
