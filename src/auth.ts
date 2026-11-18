import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { forwardAuthRequest, fetchCurrentUser } from "@/lib/auth";
import type { AuthForwardResult } from "@/app/_types";
import { getSafeCallbackUrl } from "@/lib/auth-redirect";

class FreshCartCredentialsError extends CredentialsSignin {
  code = "auth-service-unavailable";

  constructor(code: string) {
    super();
    this.code = code;
  }
}

export const { handlers, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  // Vercel terminates TLS at its edge and forwards requests to the function.
  // Trust the forwarded host/protocol so Auth.js can build callback URLs correctly.
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/signin" },
  providers: [
    Credentials({
      id: "credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials.email === "string" ? credentials.email.trim() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        let result: AuthForwardResult;
        try {
          result = await forwardAuthRequest("signin", { email, password });
        } catch {
          throw new FreshCartCredentialsError("auth-service-unavailable");
        }
        if (result.status < 200 || result.status >= 300) {
          throw new FreshCartCredentialsError(
            result.status >= 500
              ? "auth-service-unavailable"
              : result.status === 429
                ? "too-many-requests"
                : "invalid-credentials",
          );
        }
        const apiToken = result.data.token ?? result.data.data?.token;
        if (!apiToken) throw new FreshCartCredentialsError("auth-session-incomplete");

        let user = result.data.user ?? result.data.data?.user;
        if (!user && (result.data.data?._id || result.data.data?.id)) {
          user = result.data.data as NonNullable<typeof user>;
        }
        if (!user?._id && !user?.id) {
          let currentUser: AuthForwardResult;
          try {
            currentUser = await fetchCurrentUser(apiToken);
          } catch {
            throw new FreshCartCredentialsError("auth-service-unavailable");
          }
          if (currentUser.status < 200 || currentUser.status >= 300) {
            throw new FreshCartCredentialsError("auth-session-incomplete");
          }
          user = currentUser.data.user ?? currentUser.data.data?.user;
          if (!user && (currentUser.data.data?._id || currentUser.data.data?.id)) {
            user = currentUser.data.data as NonNullable<typeof user>;
          }
        }
        const userId = user?._id ?? user?.id;
        if (!user || !userId) throw new FreshCartCredentialsError("auth-session-incomplete");

        return {
          id: userId,
          _id: userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          apiToken,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const isPrivateRoute =
        pathname === "/cart" ||
        pathname.startsWith("/cart/") ||
        pathname === "/wishlist" ||
        pathname.startsWith("/wishlist/") ||
        pathname === "/checkout" ||
        pathname.startsWith("/checkout/") ||
        pathname.startsWith("/account/");

      if (!auth?.user && isPrivateRoute) {
        const signInUrl = new URL("/signin", request.nextUrl);
        signInUrl.searchParams.set(
          "callbackUrl",
          `${pathname}${request.nextUrl.search}`,
        );
        return Response.redirect(signInUrl);
      }

      if (auth?.user && (pathname === "/signin" || pathname === "/signup")) {
        // Single source of truth for callbackUrl validation (also blocks tab/newline tricks).
        const safePath = getSafeCallbackUrl(
          request.nextUrl.searchParams.get("callbackUrl") ?? undefined,
        );
        return Response.redirect(new URL(safePath, request.nextUrl.origin));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.apiToken = user.apiToken;
        token.userId = user._id;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user._id = typeof token.userId === "string" ? token.userId : token.sub ?? "";
        session.user.phone = typeof token.phone === "string" ? token.phone : undefined;
        session.user.role = typeof token.role === "string" ? token.role : undefined;
      }
      return session;
    },
  },
});
