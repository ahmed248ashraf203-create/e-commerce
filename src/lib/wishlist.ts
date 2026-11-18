import "server-only";
import type { WishlistApiResponse } from "@/app/_types";
import { ROUTE_API_V1_URL } from "@/lib/api-config";

const WISHLIST_URL = `${ROUTE_API_V1_URL}/wishlist`;

async function readResponse(response: Response): Promise<WishlistApiResponse> {
  return response.json().catch(() => ({})) as Promise<WishlistApiResponse>;
}

export async function getApiWishlist(token: string) {
  const response = await fetch(WISHLIST_URL, { headers: { token }, cache: "no-store" });
  return { status: response.status, data: await readResponse(response) };
}

export async function addApiWishlistItem(token: string, productId: string) {
  const response = await fetch(WISHLIST_URL, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
    cache: "no-store",
  });
  return { status: response.status, data: await readResponse(response) };
}

export async function removeApiWishlistItem(token: string, productId: string) {
  const response = await fetch(`${WISHLIST_URL}/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readResponse(response) };
}
