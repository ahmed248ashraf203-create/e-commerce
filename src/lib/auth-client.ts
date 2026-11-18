import type { AuthAction, AuthApiResponse, AuthClientResult, AuthRequestBody } from "@/app/_types";

async function readClientResponse(response: Response): Promise<AuthApiResponse> {
  return response.json().catch(() => ({})) as Promise<AuthApiResponse>;
}

export async function submitAuthRequest(action: AuthAction, body: AuthRequestBody): Promise<AuthClientResult> {
  try {
    const response = await fetch(`/api/account-auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return { ok: response.ok, status: response.status, data: await readClientResponse(response) };
  } catch {
    return { ok: false, status: 0, data: { message: "networkError" } };
  }
}

export function getSignInErrorMessage(
  result: { error?: string | null; code?: string | null; url?: string | null },
  locale: "en" | "ar",
  fallback: string,
): string {
  let code = result.code ?? result.error ?? "";
  if (result.url) {
    try {
      code = new URL(result.url, window.location.origin).searchParams.get("code") ?? code;
    } catch {
      // Keep the generic safe message when the response URL cannot be parsed.
    }
  }

  const normalizedCode = code.toLowerCase();
  if (
    normalizedCode.includes("invalid-credentials") ||
    normalizedCode === "credentialssignin" ||
    normalizedCode === "credentials"
  ) {
    return locale === "ar"
      ? "البريد الإلكتروني أو كلمة المرور غير صحيحة. تأكد من نفس البيانات التي سجلت بها."
      : "Email or password is incorrect. Check the same details you used to sign up.";
  }
  if (normalizedCode.includes("too-many-requests")) {
    return locale === "ar"
      ? "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى."
      : "Too many attempts. Please wait a moment and try again.";
  }
  if (
    normalizedCode.includes("auth-service-unavailable") ||
    normalizedCode.includes("callbackrouteerror")
  ) {
    return locale === "ar"
      ? "تعذر الاتصال بخدمة تسجيل الدخول الآن. حاول مرة أخرى بعد قليل."
      : "The sign-in service could not be reached. Please try again shortly.";
  }
  if (normalizedCode.includes("auth-session-incomplete")) {
    return locale === "ar"
      ? "تم قبول بياناتك لكن تعذر إنشاء الجلسة. حاول تسجيل الدخول مرة أخرى أو أعد إنشاء كلمة المرور."
      : "Your details were accepted, but we couldn't create a session. Try again or reset your password.";
  }
  return fallback;
}
