import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("x-api-k-token")?.value;
    const { pathname } = request.nextUrl;

    const protectedRoutes = ["/"];

    const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    if (token && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!token && isProtected) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"]
};