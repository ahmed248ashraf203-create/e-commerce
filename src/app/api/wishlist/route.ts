import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { addApiWishlistItem, getApiWishlist } from "@/lib/wishlist";
import type { WishlistRequestBody } from "@/app/_types";

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
  if (!token) return NextResponse.json({ message: "Please sign in to view your wishlist." }, { status: 401 });
  try {
    const result = await getApiWishlist(token);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't load your wishlist." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to save favorites." }, { status: 401 });
  let body: WishlistRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.productId !== "string" || !body.productId.trim()) {
    return NextResponse.json({ message: "A product ID is required." }, { status: 400 });
  }
  try {
    const result = await addApiWishlistItem(token, body.productId.trim());
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't save this favorite." }, { status: 502 });
  }
}
