import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  ignoredRoutes: [
    "/api/stores/:path*/category",
    "/api/stores/:path*/product",
    "/api/stores/:path*/product/:path*",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
