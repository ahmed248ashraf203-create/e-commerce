import axios from "axios";
import { cacheLife } from "next/cache";
import type { ApiItemResponse, ApiListResponse, ApiResult, Brand, Category, Product } from "@/app/_types";
import { ROUTE_API_V1_URL } from "@/lib/api-config";

const api = axios.create({ baseURL: ROUTE_API_V1_URL, timeout: 12000 });

async function fetchCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  const response = await api.get<ApiListResponse<Category>>("/categories");
  return response.data.data;
}

export async function getCategories(): Promise<ApiResult<Category[]>> {
  try {
    return { ok: true, data: await fetchCategories() };
  } catch {
    return { ok: false };
  }
}

async function fetchAllProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  const first = await api.get<ApiListResponse<Product>>("/products", { params: { page: 1 } });
  const pageCount = first.data.metadata.numberOfPages;
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      api.get<ApiListResponse<Product>>("/products", { params: { page: index + 2 } }),
    ),
  );
  return [...first.data.data, ...remainingPages.flatMap((response) => response.data.data)];
}

export async function getProducts(): Promise<ApiResult<Product[]>> {
  try {
    return { ok: true, data: await fetchAllProducts() };
  } catch {
    return { ok: false };
  }
}

async function fetchProductById(productId: string): Promise<Product> {
  "use cache";
  cacheLife("minutes");
  const response = await api.get<ApiItemResponse<Product>>(`/products/${encodeURIComponent(productId)}`);
  return response.data.data;
}

export async function getProductById(productId: string): Promise<ApiResult<Product>> {
  try {
    return { ok: true, data: await fetchProductById(productId) };
  } catch {
    return { ok: false };
  }
}

async function fetchBrands(): Promise<Brand[]> {
  "use cache";
  cacheLife("hours");
  const response = await api.get<ApiListResponse<Brand>>("/brands");
  return response.data.data;
}

export async function getBrands(): Promise<ApiResult<Brand[]>> {
  try {
    return { ok: true, data: await fetchBrands() };
  } catch {
    return { ok: false };
  }
}

async function fetchBrandById(brandId: string): Promise<Brand> {
  "use cache";
  cacheLife("hours");
  const response = await api.get<ApiItemResponse<Brand>>(`/brands/${encodeURIComponent(brandId)}`);
  return response.data.data;
}

export async function getBrandById(brandId: string): Promise<ApiResult<Brand>> {
  try {
    return { ok: true, data: await fetchBrandById(brandId) };
  } catch {
    return { ok: false };
  }
}

async function fetchProductsByBrand(brandId: string): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  const response = await api.get<ApiListResponse<Product>>("/products", {
    params: { brand: brandId, limit: 40 },
  });
  return response.data.data;
}

export async function getProductsByBrand(brandId: string): Promise<ApiResult<Product[]>> {
  try {
    return { ok: true, data: await fetchProductsByBrand(brandId) };
  } catch {
    return { ok: false };
  }
}
