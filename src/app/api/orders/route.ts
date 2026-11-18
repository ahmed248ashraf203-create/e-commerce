import { NextResponse, type NextRequest } from "next/server";
import { getSessionApiToken, getSessionApiUserId } from "@/lib/auth";
import { createOrder, getUserOrders } from "@/lib/orders";
import type { CheckoutRequestBody } from "@/app/_types";

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
  const [token, userId] = await Promise.all([
    getSessionApiToken(request),
    getSessionApiUserId(request),
  ]);
  if (!token || !userId) {
    return NextResponse.json({ message: "Please sign in to view your orders." }, { status: 401 });
  }
  try {
    const result = await getUserOrders(token, userId);
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't load your orders." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  }
  const token = await getSessionApiToken(request);
  if (!token) {
    return NextResponse.json({ message: "Please sign in to place an order." }, { status: 401 });
  }

  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid checkout details." }, { status: 400 });
  }
  const address = body.shippingAddress;
  if (
    !address ||
    typeof address.city !== "string" || !address.city.trim() ||
    typeof address.details !== "string" || !address.details.trim() ||
    typeof address.phone !== "string" || !address.phone.trim()
  ) {
    return NextResponse.json({ message: "City, street address, and phone are required." }, { status: 400 });
  }
  if (body.paymentMethod && body.paymentMethod !== "cash" && body.paymentMethod !== "online") {
    return NextResponse.json({ message: "Unsupported payment method." }, { status: 400 });
  }

  try {
    const result = await createOrder(token, request.nextUrl.origin, {
      paymentMethod: body.paymentMethod ?? "cash",
      shippingAddress: {
        city: address.city.trim(),
        details: address.details.trim(),
        phone: address.phone.trim(),
        ...(typeof address.postalCode === "string" && address.postalCode.trim()
          ? { postalCode: address.postalCode.trim() }
          : {}),
      },
    });
    return NextResponse.json(result.data, { status: result.status });
  } catch {
    return NextResponse.json({ message: "We couldn't place your order. Please try again." }, { status: 502 });
  }
}
