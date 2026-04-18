import { z } from "zod";

const BASE = process.env.DUMMYJSON_BASE_URL ?? "https://dummyjson.com";

export const ProductSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().transform((v) => parseFloat(v.toFixed(2))),
  discountPercentage: z.number().transform((v) => parseFloat(v.toFixed(2))),
  rating: z.number(),
  stock: z.number().int(),
  tags: z.array(z.string()).default([]),
  brand: z.string().optional(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
});

export type Product = z.infer<typeof ProductSchema>;

const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
});

async function apiFetch<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`DummyJSON error: ${res.status} ${path}`);
  const json = await res.json();
  return schema.parse(json);
}

export async function getProducts(limit = 20, skip = 0, category?: string) {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`
    : `/products?limit=${limit}&skip=${skip}`;
  return apiFetch(path, ProductsResponseSchema);
}

export async function getProduct(id: number) {
  return apiFetch(`/products/${id}`, ProductSchema);
}

export async function getCategories() {
  return apiFetch("/products/categories", z.array(CategorySchema));
}

export async function searchProducts(q: string, limit = 20, skip = 0) {
  return apiFetch(
    `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
    ProductsResponseSchema
  );
}
