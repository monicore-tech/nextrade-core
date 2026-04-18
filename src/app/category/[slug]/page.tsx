import { getProducts, getCategories } from "@/lib/dummyApi";
import { ProductGrid } from "@/components/product-grid";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 3600;

const LIMIT = 20;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const currentPage = Math.max(1, Number(page ?? 1));
  const skip = (currentPage - 1) * LIMIT;

  const { products, total } = await getProducts(LIMIT, skip, slug);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold capitalize">{category.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">{total} products</p>
      </div>
      <ProductGrid products={products} />
      <Pagination total={total} limit={LIMIT} skip={skip} />
    </div>
  );
}
