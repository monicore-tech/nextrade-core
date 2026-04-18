import { getProducts } from "@/lib/dummyApi";
import { ProductGrid } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";

const LIMIT = 20;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page ?? 1));
  const skip = (currentPage - 1) * LIMIT;

  const { products, total } = await getProducts(LIMIT, skip);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} products available</p>
      </div>
      <ProductGrid products={products} />
      <Pagination total={total} limit={LIMIT} skip={skip} />
    </div>
  );
}
