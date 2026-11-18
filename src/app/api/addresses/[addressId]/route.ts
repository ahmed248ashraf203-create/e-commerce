import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { deleteUserAddress, getUserAddress } from "@/lib/orders";
import type { AddressRouteContext } from "@/app/_types";

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function DELETE(request: NextRequest, { params }: AddressRouteContext) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to remove an address." }, { status: 401 });
  const { addressId } = await params;
  if (!addressId) return NextResponse.json({ message: "An address ID is required." }, { status: 400 });
  try {
    const result = await deleteUserAddress(token, addressId);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't remove this address." }, { status: 502 });
  }
}

export async function GET(request: NextRequest, { params }: AddressRouteContext) {
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to view this address." }, { status: 401 });
  const { addressId } = await params;
  if (!addressId) return NextResponse.json({ message: "An address ID is required." }, { status: 400 });
  try {
    const result = await getUserAddress(token, addressId);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't load this address." }, { status: 502 });
  }
}
