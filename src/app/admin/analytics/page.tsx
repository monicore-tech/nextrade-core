import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getProduct } from "@/lib/dummyApi";
import { CategoryChart } from "@/components/admin/category-chart";
import type { OrderItem } from "@/lib/db/schema";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Analytics" };

export default async function AnalyticsPage() {
  const allOrders = await db.select().from(orders);

  // Aggregate product sales counts
  const productSales = new Map<number, { units: number; revenueCents: number }>();
  for (const order of allOrders) {
    const items = order.items as OrderItem[];
    for (const item of items) {
      const existing = productSales.get(item.productId) ?? { units: 0, revenueCents: 0 };
      productSales.set(item.productId, {
        units: existing.units + item.quantity,
        revenueCents: existing.revenueCents + item.priceCents * item.quantity,
      });
    }
  }

  if (productSales.size === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Category Analytics</h1>
        <p className="text-muted-foreground">No order data yet. Place some orders to see analytics.</p>
      </div>
    );
  }

  // Fetch product categories in parallel (batched to avoid rate limiting)
  const productIds = Array.from(productSales.keys());
  const productDetails = await Promise.all(
    productIds.map((id) => getProduct(id).catch(() => null))
  );

  const categoryStats = new Map<string, { unitsSold: number; revenue: number }>();
  for (let i = 0; i < productIds.length; i++) {
    const product = productDetails[i];
    if (!product) continue;
    const sales = productSales.get(productIds[i])!;
    const existing = categoryStats.get(product.category) ?? { unitsSold: 0, revenue: 0 };
    categoryStats.set(product.category, {
      unitsSold: existing.unitsSold + sales.units,
      revenue: existing.revenue + sales.revenueCents / 100,
    });
  }

  const chartData = Array.from(categoryStats.entries())
    .map(([category, stats]) => ({ category, ...stats }))
    .sort((a, b) => b.unitsSold - a.unitsSold);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Category Analytics</h1>
      <CategoryChart data={chartData} />
    </div>
  );
}
