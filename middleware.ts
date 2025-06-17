import authConfig from './auth.config';
import NextAuth from 'next-auth';
import {
    apiAuthPrefix,
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    LOGIN,
    publicRoutes,
} from './routes';

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req) {
    const { nextUrl } = req;

    const isAuthenticated = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    if (isApiAuthRoute) return;

    if (isAuthRoute) {
        if (isAuthenticated) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return;
    }

    if (!isAuthenticated && !isPublicRoute) {
        return Response.redirect(LOGIN);
    }

    return;
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { LOGIN } from '@/helpers/NAVIGATE_LINKS';

// const protectedRoutes = ['/profile', '/settings'];
// const guestRoutes = ['/sign-in', '/sign-up'];

// export default async function middleware(request: NextRequest) {
//     const { pathname, origin } = request.nextUrl;

//     const isProtectedRoute = protectedRoutes.some((route) =>
//         pathname.startsWith(route)
//     );
//     const isGuestRoute = guestRoutes.some((route) =>
//         pathname.startsWith(route)
//     );

//     if (!isProtectedRoute && !isGuestRoute) return NextResponse.next();

//     const session = await auth();

//     if (isProtectedRoute && !session) {
//         const authRedirectURL = new URL(LOGIN.href, origin);
//         return NextResponse.redirect(authRedirectURL.toString());
//     }

//     if (isGuestRoute && !!session) {
//         return NextResponse.redirect(new URL(HOME.href, origin));
//     }

//     return NextResponse.next();
// }
