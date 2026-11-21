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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user as { role?: string } | undefined;
  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const role = user.role || "customer";

  // 2. Root /dashboard -> send to the user's role-specific dashboard
  if (pathname === "/dashboard") {
    const destination =
      role === "admin" ? "/dashboard/admin" : "/dashboard/customer";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // 3. Only Admin can access /dashboard/admin/*
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/customer", request.url));
  }

  // 4. Only Customers can access /dashboard/customer/*
  if (pathname.startsWith("/dashboard/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path","/dashboard/:path*"],
};