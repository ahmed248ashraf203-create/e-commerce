import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken } from "@/lib/auth";
import { createUserAddress, getUserAddresses } from "@/lib/orders";
import type { AddressRequestBody } from "@/app/_types";

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
  if (!token) return NextResponse.json({ message: "Please sign in to view addresses." }, { status: 401 });
  try {
    const result = await getUserAddresses(token);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't load your addresses." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  const token = await getSessionApiToken(request);
  if (!token) return NextResponse.json({ message: "Please sign in to save an address." }, { status: 401 });
  let body: AddressRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid address details." }, { status: 400 });
  }
  if (![body.name, body.city, body.details, body.phone].every((value) => typeof value === "string" && value.trim())) {
    return NextResponse.json({ message: "Name, city, street address, and phone are required." }, { status: 400 });
  }
  try {
    const result = await createUserAddress(token, {
      name: body.name?.trim(),
      city: body.city?.trim(),
      details: body.details?.trim(),
      phone: body.phone?.trim(),
      ...(typeof body.postalCode === "string" && body.postalCode.trim() ? { postalCode: body.postalCode.trim() } : {}),
    });
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't save this address." }, { status: 502 });
  }
}
