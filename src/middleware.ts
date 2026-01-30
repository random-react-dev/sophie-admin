import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Get current user session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Allow access to login page without authentication
    if (request.nextUrl.pathname === "/login") {
        if (user) {
            // If already logged in, redirect to dashboard
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        return supabaseResponse;
    }

    // Protect all other routes - require authentication
    if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Check if user is admin (optional - can be enforced per-page)
    const isAdmin = user.user_metadata?.is_admin === true;
    if (!isAdmin) {
        // For now, allow access but pages can check individually
        // In production, you might want to redirect non-admins
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
