import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { RevenueCharts } from "@/components/admin/revenue-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Revenue" };

export default async function AdminPage() {
  const allOrders = await db.select().from(orders);

  const totalRevenue = allOrders.reduce((s, o) => s + o.totalCents, 0) / 100;
  const totalOrders = allOrders.length;

  // Build daily revenue for last 30 days
  const now = new Date();
  const days: Map<string, number> = new Map();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    days.set(key, 0);
  }

  for (const order of allOrders) {
    const d = new Date(order.createdAt);
    if ((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) <= 30) {
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days.set(key, (days.get(key) ?? 0) + order.totalCents / 100);
    }
  }

  let cumulative = 0;
  const chartData = Array.from(days.entries()).map(([date, revenue]) => {
    cumulative += revenue;
    return { date, revenue: parseFloat(revenue.toFixed(2)), cumulative: parseFloat(cumulative.toFixed(2)) };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Revenue Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalOrders}</p></CardContent>
        </Card>
      </div>

      <RevenueCharts data={chartData} />
    </div>
  );
}
