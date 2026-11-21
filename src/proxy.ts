// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from './lib/auth'
// import { headers } from 'next/headers'

// // This function can be marked `async` if using `await` inside
// export async function proxy(request: NextRequest) {

//     const session = await auth.api.getSession({
//         headers: await headers()
//     })
//      const user = session?.user;
      
//     if(!user)
//     // console.log(user);
//   return NextResponse.redirect(new URL('/sign-in', request.url))



  
// }

// // Alternatively, you can use a default export:
// // export default function proxy(request: NextRequest) { ... }

// export const config = {
//   matcher: '/about/:path*',
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

/**
 * Guards every `/dashboard` route:
 *
 *  1. Unauthenticated  -> /sign-in
 *  2. Blocked account  -> / (no protected platform features)
 *  3. /dashboard       -> the user's own role dashboard
 *  4. /dashboard/admin    -> admin only
 *  5. /dashboard/customer -> customer only
 *
 * Everything else (public site, /services, /sign-in) is untouched — see the
 * matcher at the bottom.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // `isBlocked` is written by the Express API (PATCH /users/:id/status) onto
  // the same `salonbook.user` record Better Auth reads, so it rides along on
  // the session user even though it is not a declared Better Auth field.
  const user = session?.user as
    | { role?: string; isBlocked?: boolean }
    | undefined;

  // 1. Not signed in -> Sign In page.
  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Blocked accounts lose every protected platform feature. They keep a
  //    valid session (the navbar still renders) but every dashboard route
  //    sends them back to the public home page. No loop: `/` is not matched.
  if (user.isBlocked) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only two roles exist (better-auth `additionalFields.role`). Collapsing to
  // a boolean here guarantees the two cross-role redirects below can never
  // bounce a request back and forth between the two dashboards.
  const isAdmin = user.role === "admin";

  // 3. Root /dashboard -> send to the user's role-specific dashboard
  if (pathname === "/dashboard") {
    const destination = isAdmin ? "/dashboard/admin" : "/dashboard/customer";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 4. Only Admin can access /dashboard/admin/*
  if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // 5. Only Customers can access /dashboard/customer/*
  if (pathname.startsWith("/dashboard/customer") && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // /dashboard/profile (and anything else under /dashboard) only needs a
  // signed-in, non-blocked session.
  return NextResponse.next();
}

export const config = {
  // Dashboard only, per requirement. `/services` is deliberately absent:
  // service browsing is public, and BookingWidget already sends guests to
  // /sign-in when they try to submit a booking.
  matcher: ["/dashboard", "/dashboard/:path*"],
};