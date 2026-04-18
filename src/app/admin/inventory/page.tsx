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
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Inventory" };
export const revalidate = 300;

export default async function InventoryPage() {
  const { products } = await getProducts(100, 0);
  const lowStock = products.filter((p) => p.stock < 10);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory Tracker</h1>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>{outOfStock.length} out of stock</span>
          <span>·</span>
          <span>{lowStock.length} low stock (&lt;10)</span>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{lowStock.length} products are running low on stock.</span>
        </div>
      )}

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
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={product.stock === 0 ? "bg-red-50 dark:bg-red-950/20" : product.stock < 10 ? "bg-amber-50 dark:bg-amber-950/20" : ""}
            >
              <TableCell className="font-medium max-w-[200px] truncate">{product.title}</TableCell>
              <TableCell className="capitalize text-muted-foreground text-sm">{product.category}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className={product.stock < 10 ? "font-bold" : ""}>{product.stock}</TableCell>
              <TableCell>
                {product.stock === 0 ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : product.stock < 10 ? (
                  <Badge className="bg-amber-500 hover:bg-amber-500">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary">In Stock</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
