import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { removeApiCartItem, updateApiCartItem } from "@/lib/cart";
import type { CartRouteContext, CartUpdateRequestBody } from "@/app/_types";

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function PUT(request: NextRequest, { params }: CartRouteContext) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to update your cart." }, { status: 401 });
  const { productId } = await params;
  let body: CartUpdateRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.count !== "number" || !Number.isInteger(body.count) || body.count < 1 || body.count > 99) {
    return NextResponse.json({ message: "Quantity must be between 1 and 99." }, { status: 400 });
  }
  try {
    const result = await updateApiCartItem(token, productId, body.count);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't update this item." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest, { params }: CartRouteContext) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to manage your cart." }, { status: 401 });
  const { productId } = await params;
  try {
    const result = await removeApiCartItem(token, productId);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't remove this item." }, { status: 502 });
  }
}
