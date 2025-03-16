import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("firebase-auth-token")?.value; // Ensure token value is retrieved

    if (!token) {
        // If no token and user is trying to access /tracker, redirect to login
        if (req.nextUrl.pathname.startsWith("/tracker")) {
            return NextResponse.redirect(new URL("/auth/login-page", req.url));
        }
    }

    return NextResponse.next(); // Allow access if token exists
}

export const config = {
    matcher: ["/tracker/:path*"], // Apply to tracker routes
};
