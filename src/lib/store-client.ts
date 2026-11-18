import { getSession, signOut } from "next-auth/react";
import type { AddressApiResponse, AddressRequestBody, CartApiProduct, CartApiResponse, CartSnapshot, CheckoutRequestBody, CheckoutResponse, Order, OrderApiResponse, Product, SavedAddress, StoreClientResult, WishlistApiResponse } from "@/app/_types";

let handlingExpiredSession = false;

// fetch() wrapper: if the server says 401 while the user still looks signed in,
// the backend token expired -> clear the session and send the user to /signin.
async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401 && typeof window !== "undefined" && !handlingExpiredSession) {
    const session = await getSession().catch(() => null);
    if (session?.user) {
      handlingExpiredSession = true;
      const callbackUrl = `${window.location.pathname}${window.location.search}`;
      await signOut({ redirect: false });
      window.location.assign(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }
  return response;
}

async function readJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({})) as Promise<T>;
}

function cartLines(payload: CartApiResponse): CartApiProduct[] {
  const root = Array.isArray(payload.data) ? undefined : payload.data;
  return (Array.isArray(payload.data) ? payload.data : root?.products ?? payload.products ?? []) as CartApiProduct[];
}

export function normalizeCart(payload: CartApiResponse): CartSnapshot {
  const root = Array.isArray(payload.data) ? undefined : payload.data;
  const items = cartLines(payload).flatMap((line) => {
    if (!line.product || typeof line.product === "string") return [];
    const count = Math.max(1, Number(line.count) || 1);
    const linePrice = Number(line.price);
    const productPrice = Number(line.product.price);
    const discountedPrice = Number(line.product.priceAfterDiscount);
    const fallbackPrice = Number.isFinite(discountedPrice) && discountedPrice >= 0 && discountedPrice < productPrice
      ? discountedPrice
      : productPrice;
    const unitPrice = Number.isFinite(linePrice) && line.price !== undefined && linePrice >= 0
      ? linePrice
      : fallbackPrice;
    return [{ product: line.product, count, unitPrice }];
  });
  const itemCount = Number(payload.numOfCartItems ?? root?.numOfCartItems ?? items.reduce((sum, item) => sum + item.count, 0));
  // Derive subtotal from the exact per-line price displayed below so the cart
  // rows, subtotal, estimated total, and checkout all agree.
  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.count, 0);
  return {
    items,
    itemCount: Number.isFinite(itemCount) ? itemCount : 0,
    totalPrice: Number.isFinite(totalPrice) ? totalPrice : 0,
    cartId: payload.cartId ?? root?.cartId ?? root?._id,
  };
}

export async function fetchCart(): Promise<StoreClientResult<CartSnapshot>> {
  try {
    const response = await apiFetch("/api/cart", { cache: "no-store" });
    const payload = await readJson<CartApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeCart(payload) } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export async function mutateCart(path: string, method: "POST" | "PUT" | "DELETE", body?: Record<string, string | number>): Promise<StoreClientResult<CartSnapshot>> {
  try {
    const response = await apiFetch(path, {
      method,
      ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    });
    const payload = await readJson<CartApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeCart(payload), message: payload.message } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export function normalizeWishlist(payload: WishlistApiResponse): Product[] {
  if (Array.isArray(payload.data)) return payload.data;
  return payload.data?.products ?? [];
}

export async function fetchWishlist(): Promise<StoreClientResult<Product[]>> {
  try {
    const response = await apiFetch("/api/wishlist", { cache: "no-store" });
    const payload = await readJson<WishlistApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeWishlist(payload) } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export async function mutateWishlist(productId: string, remove: boolean): Promise<StoreClientResult<Product[]>> {
  try {
    const response = await apiFetch(remove ? `/api/wishlist/${encodeURIComponent(productId)}` : "/api/wishlist", {
      method: remove ? "DELETE" : "POST",
      ...(!remove ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId }) } : {}),
    });
    const payload = await readJson<WishlistApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeWishlist(payload), message: payload.message } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export function normalizeOrders(payload: OrderApiResponse): Order[] {
  if (Array.isArray(payload.data)) return payload.data;
  return payload.data?.orders ?? payload.orders ?? [];
}

export async function fetchOrders(): Promise<StoreClientResult<Order[]>> {
  try {
    const response = await apiFetch("/api/orders", { cache: "no-store" });
    const payload = await readJson<OrderApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeOrders(payload) } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export function normalizeAddresses(payload: AddressApiResponse): SavedAddress[] {
  if (Array.isArray(payload.data)) return payload.data;
  return payload.data && "addresses" in payload.data
    ? payload.data.addresses ?? []
    : payload.addresses ?? [];
}

export async function fetchAddresses(): Promise<StoreClientResult<SavedAddress[]>> {
  try {
    const response = await apiFetch("/api/addresses", { cache: "no-store" });
    const payload = await readJson<AddressApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeAddresses(payload) } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export async function saveAddress(address: AddressRequestBody): Promise<StoreClientResult<SavedAddress[]>> {
  try {
    const response = await apiFetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    const payload = await readJson<AddressApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeAddresses(payload), message: payload.message } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export async function removeAddress(addressId: string): Promise<StoreClientResult<SavedAddress[]>> {
  try {
    const response = await apiFetch(`/api/addresses/${encodeURIComponent(addressId)}`, { method: "DELETE" });
    const payload = await readJson<AddressApiResponse>(response);
    return response.ok ? { ok: true, data: normalizeAddresses(payload), message: payload.message } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}

export async function submitOrder(body: CheckoutRequestBody): Promise<StoreClientResult<CheckoutResponse>> {
  try {
    const response = await apiFetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await readJson<CheckoutResponse>(response);
    return response.ok ? { ok: true, data: payload } : { ok: false, message: payload.message };
  } catch {
    return { ok: false };
  }
}
