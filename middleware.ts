import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  ignoredRoutes(req) {
    const isMethodGET = req.method === "GET";
    const path = req.nextUrl.pathname;

    //Allow GET requests to /api/stores/:path*/category
    if (
      isMethodGET &&
      path.startsWith("/api/stores/") &&
      path.endsWith("/category")
    ) {
      return true;
    }

    //Allow GET requests to /api/stores/:path*/product and /api/stores/:path*/product/:path*
    if (
      isMethodGET &&
      path.startsWith("/api/stores/") &&
      path.includes("/category")
    ) {
      return true;
    }

    return false;
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
