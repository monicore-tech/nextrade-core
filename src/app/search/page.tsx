import { searchProducts } from "@/lib/dummyApi";
import { ProductGrid } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";

const LIMIT = 20;

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page } = await searchParams;

  if (!q?.trim()) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Enter a search term to find products.</p>
      </div>
    );
  }

  const currentPage = Math.max(1, Number(page ?? 1));
  const skip = (currentPage - 1) * LIMIT;
  const { products, total } = await searchProducts(q, LIMIT, skip);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Results for <span className="text-primary">&quot;{q}&quot;</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{total} products found</p>
      </div>
      <ProductGrid products={products} />
      <Pagination total={total} limit={LIMIT} skip={skip} />
    </div>
  );
}
