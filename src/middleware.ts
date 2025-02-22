// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("firebase-auth-token"); // Check authentication token

    if (!token && req.nextUrl.pathname.startsWith("/tracker")) {
        return NextResponse.redirect(new URL("/auth/login-page", req.url));
    }
}

export const config = {
    matcher: ["/tracker/:path*"], // Apply to these routes
};
