import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { removeApiWishlistItem } from "@/lib/wishlist";
import type { WishlistRouteContext } from "@/app/_types";

export async function DELETE(request: NextRequest, { params }: WishlistRouteContext) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== request.nextUrl.origin) {
        return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
    }
  }
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to manage your wishlist." }, { status: 401 });
  const { productId } = await params;
  try {
    const result = await removeApiWishlistItem(token, productId);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't remove this favorite." }, { status: 502 });
  }
}
