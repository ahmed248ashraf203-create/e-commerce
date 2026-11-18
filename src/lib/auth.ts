import "server-only";
import { getToken } from "next-auth/jwt";
import { ROUTE_API_V1_URL } from "@/lib/api-config";

import type {
  AuthAction,
  AuthApiResponse,
  AuthForwardResult,
  AuthRequestBody,
} from "@/app/_types";

const authEndpoints: Record<
  AuthAction,
  { path: string; method: "POST" | "PUT" }
> = {
  signup: { path: "/auth/signup", method: "POST" },
  signin: { path: "/auth/signin", method: "POST" },
  "forgot-password": { path: "/auth/forgotPasswords", method: "POST" },
  "verify-reset-code": { path: "/auth/verifyResetCode", method: "POST" },
  "reset-password": { path: "/auth/resetPassword", method: "PUT" },
  "change-password": { path: "/users/changeMyPassword", method: "PUT" },
  "update-profile": { path: "/users/updateMe/", method: "PUT" },
};

export async function getSessionApiToken(
  request: Request,
): Promise<string | undefined> {
  return (await getSessionApi(request))?.apiToken;
}

export async function getSessionApiUserId(
  request: Request,
): Promise<string | undefined> {
  return (await getSessionApi(request))?.userId;
}

async function getSessionApi(
  request: Request,
): Promise<{ apiToken?: string; userId?: string } | undefined> {
  // Behind a reverse proxy request.url can be http even when the browser used https,
  // which would make getToken look for the wrong cookie name.
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const secureCookie =
    forwardedProto === "https" ||
    (!forwardedProto && new URL(request.url).protocol === "https:");
  const session = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie,
  });
  if (!session) return undefined;
  return {
    apiToken: typeof session.apiToken === "string" ? session.apiToken : undefined,
    userId: typeof session.userId === "string" ? session.userId : typeof session.sub === "string" ? session.sub : undefined,
  };
}

async function readApiResponse(response: Response): Promise<AuthApiResponse> {
  return response.json().catch(() => ({})) as Promise<AuthApiResponse>;
}

export async function forwardAuthRequest(
  action: AuthAction,
  body: AuthRequestBody,
  token?: string,
): Promise<AuthForwardResult> {
  const endpoint = authEndpoints[action];
  const response = await fetch(`${ROUTE_API_V1_URL}${endpoint.path}`, {
    method: endpoint.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { token } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return { status: response.status, data: await readApiResponse(response) };
}

export async function fetchCurrentUser(
  token: string,
): Promise<AuthForwardResult> {
  const response = await fetch(`${ROUTE_API_V1_URL}/users/getMe`, {
    headers: { token },
    cache: "no-store",
  });
  return { status: response.status, data: await readApiResponse(response) };
}
