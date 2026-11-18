import { NextResponse, type NextRequest } from "next/server";
import type {
  AuthAction,
  AuthApiResponse,
  AuthRequestBody,
  AuthRouteContext,
} from "@/app/_types";
import { forwardAuthRequest, getSessionApiToken } from "@/lib/auth";

const authActions = new Set<AuthAction>([
  "signup",
  "forgot-password",
  "verify-reset-code",
  "reset-password",
  "change-password",
  "update-profile",
]);

// Only these string fields are forwarded to the backend for each action.
const allowedFields: Record<string, readonly string[]> = {
  signup: ["name", "email", "password", "rePassword", "phone"],
  "forgot-password": ["email"],
  "verify-reset-code": ["resetCode"],
  "reset-password": ["email", "newPassword"],
  "change-password": ["currentPassword", "password", "rePassword"],
  "update-profile": ["name", "email", "phone"],
};

function pickAllowed(action: string, input: Record<string, unknown>): AuthRequestBody {
  const picked: AuthRequestBody = {};
  for (const key of allowedFields[action] ?? []) {
    const value = input[key];
    if (typeof value === "string") picked[key] = value;
  }
  return picked;
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest, { params }: AuthRouteContext) {
  if (!sameOrigin(request))
    return NextResponse.json(
      { message: "Invalid request origin." },
      { status: 403 },
    );
  const { action } = await params;
  if (!authActions.has(action as AuthAction))
    return NextResponse.json(
      { message: "Unknown authentication action." },
      { status: 404 },
    );

  let body: AuthRequestBody;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("Invalid request body");
    body = pickAllowed(action, parsed as Record<string, unknown>);
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const apiToken = await getSessionApiToken(request);
  if (
    (action === "change-password" || action === "update-profile") &&
    !apiToken
  ) {
    return NextResponse.json(
      { message: "Please sign in to continue." },
      { status: 401 },
    );
  }

  try {
    const result = await forwardAuthRequest(
      action as AuthAction,
      body,
      apiToken,
    );
    const safeData = { ...result.data };
    delete safeData.token;
    if (safeData.data) {
      safeData.data = { ...safeData.data };
      delete safeData.data.token;
    }
    return NextResponse.json(safeData, { status: result.status });
  } catch {
    const data: AuthApiResponse = { message: "networkError" };
    return NextResponse.json(data, { status: 502 });
  }
}
