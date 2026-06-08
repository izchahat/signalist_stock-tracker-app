import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth/cookies";

/**
 * Enforces authentication by ensuring a session cookie exists for incoming requests.
 *
 * @returns A NextResponse that redirects to `/sign-in` when no session cookie is present, or a response that allows the request to continue otherwise.
 */
export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    // Check cookie presence - prevents obviously unauthorized users
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};
