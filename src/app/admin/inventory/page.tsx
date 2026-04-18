import { getProducts } from "@/lib/dummyApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Inventory" };
export const revalidate = 300;

export default async function InventoryPage() {
  const { products } = await getProducts(100, 0);
  const critical = products.filter((p) => p.stock === 0 || p.stock <= 5);
  const lowStock = products.filter((p) => p.stock > 5 && p.stock < 10);
  const healthy = products.filter((p) => p.stock >= 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Inventory Tracker</h1>
        <p className="text-sm text-muted-foreground">{products.length} products tracked</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Critical (≤5 or out)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">{critical.length}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Low Stock (6–9)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-500">{lowStock.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">Healthy (≥10)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{healthy.length}</p>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products
            .sort((a, b) => a.stock - b.stock)
            .map((product) => (
              <TableRow
                key={product.id}
                className={
                  product.stock === 0
                    ? "bg-red-50 dark:bg-red-950/30"
                    : product.stock <= 5
                    ? "bg-red-50/60 dark:bg-red-950/20"
                    : product.stock < 10
                    ? "bg-amber-50/60 dark:bg-amber-950/20"
                    : ""
                }
              >
                <TableCell className="font-medium max-w-50 truncate">{product.title}</TableCell>
                <TableCell className="capitalize text-muted-foreground text-sm">{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className={product.stock <= 5 ? "font-bold text-red-500" : product.stock < 10 ? "font-bold text-amber-500" : ""}>
                  {product.stock}
                </TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Badge variant="destructive" className="gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Out of Stock
                    </Badge>
                  ) : product.stock <= 5 ? (
                    <Badge className="bg-red-500 hover:bg-red-500 gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                      </span>
                      Critical
                    </Badge>
                  ) : product.stock < 10 ? (
                    <Badge className="bg-amber-500 hover:bg-amber-500">Low Stock</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-green-600">In Stock</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
