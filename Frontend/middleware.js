import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Validates token by making a request to the backend
 * @param {string} token - The access token to validate
 * @returns {Promise<boolean>} - Returns true if token is valid
 */
async function validateTokenWithBackend(token) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/auth/validate-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Token validation error in middleware:', error);
        return false;
    }
}

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

    // If there's a session with an access token, validate it for all requests
    if (session?.accessToken && !isPublicPath) {
        const isTokenValid = await validateTokenWithBackend(session.accessToken);

        if (!isTokenValid) {
            // Token is invalid/expired, redirect to login with session expired message
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("message", "session-expired");

            const response = NextResponse.redirect(loginUrl);
            // Clear the session cookie
            response.cookies.delete("next-auth.session-token");
            response.cookies.delete("__Secure-next-auth.session-token");
            return response;
        }
    }

    // Allow access to public paths without authentication
    if (isPublicPath) {
        return NextResponse.next();
    }// Protected routes that require authentication
    const protectedPaths = ["/write", "/profile", "/dashboard", "/admin"];

    const isProtectedPath = protectedPaths.some(path =>
        req.nextUrl.pathname === path ||
        req.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Redirect to login if trying to access protected route without being authenticated
    if (isProtectedPath && !session) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }    // Special protection for admin routes
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
    if (isAdminPath && (!session || !session.user.isAdmin)) {
        // If not an admin, redirect to home page with a clear message
        const homeUrl = new URL("/", req.url);
        homeUrl.searchParams.set("error", "adminAccess");
        return NextResponse.redirect(homeUrl);
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
        "/admin/:path*",
    ],
};
