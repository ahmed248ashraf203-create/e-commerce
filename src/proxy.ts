export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/cart/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/account/:path*",
    "/signin",
    "/signup",
  ],
};
