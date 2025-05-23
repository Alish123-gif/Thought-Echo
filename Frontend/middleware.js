import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Create paths that always bypass authentication
    const publicPaths = [
        "/",
        "/login",
        "/register",
        "/api/auth/signin",
        "/api/auth/signout",
    ];

    // Check if the current path is in the public paths
    const isPublicPath = publicPaths.some(path =>
        req.nextUrl.pathname === path ||
        req.nextUrl.pathname.startsWith('/api/auth/') ||
        req.nextUrl.pathname.startsWith('/public/')
    );

    // Allow access to public paths without authentication
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Protected routes that require authentication
    const protectedPaths = ["/write", "/profile", "/dashboard"];

    const isProtectedPath = protectedPaths.some(path =>
        req.nextUrl.pathname === path ||
        req.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Redirect to login if trying to access protected route without being authenticated
    if (isProtectedPath && !session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Define which paths this middleware should run on
    matcher: [
        "/",
        "/login",
        "/register",
        "/write/:path*",
        "/profile/:path*",
        "/dashboard/:path*",
    ],
};
