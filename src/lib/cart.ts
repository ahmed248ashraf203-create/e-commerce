import "server-only";
import type { CartApiResponse } from "@/app/_types";
import { ROUTE_API_V2_URL } from "@/lib/api-config";

const CART_URL = `${ROUTE_API_V2_URL}/cart`;

async function readCartResponse(response: Response): Promise<CartApiResponse> {
  return response.json().catch(() => ({})) as Promise<CartApiResponse>;
}

export async function getApiCart(token: string) {
  const response = await fetch(CART_URL, {
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readCartResponse(response) };
}

export async function addApiCartItem(token: string, productId: string, quantity = 1) {
  const currentCart = await getApiCart(token);
  const existingItem = getCartProducts(currentCart.data).find((item) =>
    typeof item.product === "string" ? item.product === productId : item.product?._id === productId,
  );
  const existingCount = Number(existingItem?.count ?? 0);

  const response = await fetch(CART_URL, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
    cache: "no-store",
  });
  let data = await readCartResponse(response);
  if (!response.ok) return { status: response.status, data };

  const targetCount = existingCount + quantity;
  if (targetCount > 1) {
    const updateResponse = await fetch(`${CART_URL}/${encodeURIComponent(productId)}`, {
      method: "PUT",
      headers: { token, "Content-Type": "application/json" },
      body: JSON.stringify({ count: targetCount }),
      cache: "no-store",
    });
    data = await readCartResponse(updateResponse);
    return { status: updateResponse.status, data };
  }
  return { status: response.status, data };
}

function getCartProducts(data: CartApiResponse) {
  if (Array.isArray(data.data)) return data.data;
  return data.data?.products ?? data.products ?? [];
}

export async function updateApiCartItem(token: string, productId: string, count: number) {
  const response = await fetch(`${CART_URL}/${encodeURIComponent(productId)}`, {
    method: "PUT",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
    cache: "no-store",
  });
  return { status: response.status, data: await readCartResponse(response) };
}

export async function removeApiCartItem(token: string, productId: string) {
  const response = await fetch(`${CART_URL}/${encodeURIComponent(productId)}`, {
    method: "DELETE",
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readCartResponse(response) };
}

export async function clearApiCart(token: string) {
  const response = await fetch(CART_URL, {
    method: "DELETE",
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readCartResponse(response) };
}
