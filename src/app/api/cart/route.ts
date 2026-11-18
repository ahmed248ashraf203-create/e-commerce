import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { addApiCartItem, clearApiCart, getApiCart } from "@/lib/cart";
import type { CartAddRequestBody } from "@/app/_types";

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to view your cart." }, { status: 401 });
  try {
    const result = await getApiCart(token);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't load your cart." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to add items to your cart." }, { status: 401 });

  let body: CartAddRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.productId !== "string" || !body.productId.trim()) {
    return NextResponse.json({ message: "A product ID is required." }, { status: 400 });
  }
  const quantity = typeof body.quantity === "number" && Number.isInteger(body.quantity) ? Math.min(99, Math.max(1, body.quantity)) : 1;

  try {
    const result = await addApiCartItem(token, body.productId.trim(), quantity);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't add this item to your cart." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to manage your cart." }, { status: 401 });
  try {
    const result = await clearApiCart(token);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't clear your cart." }, { status: 502 });
  }
}
