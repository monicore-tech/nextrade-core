import { Suspense } from "react";
import { getProducts } from "@/lib/dummyApi";
import { ProductGrid, ProductGridSkeleton } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";
import { Hero } from "@/components/hero";

const LIMIT = 20;

async function Products({ page }: { page: number }) {
  const skip = (page - 1) * LIMIT;
  const { products, total } = await getProducts(LIMIT, skip);

  return (
    <>
      <ProductGrid products={products} />
      <Pagination total={total} limit={LIMIT} skip={skip} />
    </>
  );
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));

  return (
    <div>
      <Hero />
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-bold">All Products</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse our full catalog</p>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={LIMIT} />}>
        <Products page={currentPage} />
      </Suspense>
    </div>
  );
}
