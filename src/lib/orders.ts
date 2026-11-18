import "server-only";
import type {
  AddressApiResponse,
  AddressRequestBody,
  CheckoutRequestBody,
  CheckoutResponse,
  OrderApiResponse,
} from "@/app/_types";
import { getApiCart } from "@/lib/cart";
import { ROUTE_API_BASE_URL, ROUTE_API_V1_URL } from "@/lib/api-config";

async function readJson<T>(response: Response): Promise<T> {
  return response.json().catch(() => ({})) as Promise<T>;
}

export async function createOrder(
  token: string,
  origin: string,
  body: CheckoutRequestBody,
) {
  const cartResponse = await getApiCart(token);
  if (cartResponse.status < 200 || cartResponse.status >= 300) {
    return { status: cartResponse.status, data: cartResponse.data as CheckoutResponse };
  }

  const cartData = Array.isArray(cartResponse.data.data) ? undefined : cartResponse.data.data;
  const cartId = cartResponse.data.cartId ?? cartData?.cartId ?? cartData?._id;
  const itemCount = cartResponse.data.numOfCartItems ?? cartData?.numOfCartItems;
  if (!cartId || itemCount === 0) {
    return { status: 400, data: { message: "Your cart is empty." } satisfies CheckoutResponse };
  }

  const paymentMethod = body.paymentMethod ?? "cash";
  const url = paymentMethod === "online"
    ? `${ROUTE_API_V1_URL}/orders/checkout-session/${encodeURIComponent(cartId)}?url=${encodeURIComponent(origin)}`
    : `${ROUTE_API_BASE_URL}/v2/orders/${encodeURIComponent(cartId)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify({ shippingAddress: body.shippingAddress }),
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<CheckoutResponse>(response) };
}

export async function getUserOrders(token: string, userId: string) {
  const response = await fetch(`${ROUTE_API_V1_URL}/orders/user/${encodeURIComponent(userId)}`, {
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<OrderApiResponse>(response) };
}

export async function getUserAddresses(token: string) {
  const response = await fetch(`${ROUTE_API_V1_URL}/addresses`, {
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<AddressApiResponse>(response) };
}

export async function getUserAddress(token: string, addressId: string) {
  const response = await fetch(`${ROUTE_API_V1_URL}/addresses/${encodeURIComponent(addressId)}`, {
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<AddressApiResponse>(response) };
}

export async function createUserAddress(token: string, address: AddressRequestBody) {
  const response = await fetch(`${ROUTE_API_V1_URL}/addresses`, {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: JSON.stringify(address),
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<AddressApiResponse>(response) };
}

export async function deleteUserAddress(token: string, addressId: string) {
  const response = await fetch(`${ROUTE_API_V1_URL}/addresses/${encodeURIComponent(addressId)}`, {
    method: "DELETE",
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readJson<AddressApiResponse>(response) };
}
