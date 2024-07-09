import { clerkMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/forum(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if the request is for the home page and redirect to /sign-in
  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Protect routes based on the matcher
  if (isProtectedRoute(req)) {
    await auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
