import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── SEO & Robots Fast-Path ──────────────────────────────────────────
    // Sitemap and robots.txt are public and should load instantly for crawlers.
    // Bypassing middleware reduces latency and ensures discovery by GSC.
    if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
        return NextResponse.next();
    }

    // ── Homepage Fast-Path ───────────────────────────────────────────────
    // The homepage is public and runs on edge runtime with ISR.
    // Skip the Supabase auth call entirely — saves 300-500ms on every request.
    if (pathname === '/') {
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // This refreshes the session if it's expired
    const { data: { user } } = await supabase.auth.getUser()

    // ── Admin Route Protection (edge-level) ─────────────────────────────
    // Must check BEFORE the generic protected-route block below.
    // The admin layout.tsx also checks, but this closes the gap for API routes
    // and any routes that might bypass the layout.
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check the DB profile role for this user
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const { isAdmin, isModerator } = await import('@/utils/roles')
        const hasAdminAccess =
            profile?.role === 'admin' ||
            profile?.role === 'moderator' ||
            isAdmin(user.email) ||
            isModerator(user.email)

        if (!hasAdminAccess) {
            // Silently redirect normal users — don't leak that /admin exists
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Banned admins shouldn't exist but guard anyway
        if (profile?.role === 'banned') {
            return NextResponse.redirect(new URL('/login?banned=1', request.url))
        }
    }

    // ── Banned User Block (all routes) ────────────────────────────────────
    // Banned users are set to role='banned' in profiles. Block them platform-wide.
    // Skip for login page itself and static auth routes to avoid loops.
    if (user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/auth')) {
        // Only fetch profile if we haven't already (non-admin routes)
        if (!request.nextUrl.pathname.startsWith('/admin')) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role === 'banned') {
                return NextResponse.redirect(new URL('/login?banned=1', request.url))
            }
        }
    }

    // ── General Protected Routes ─────────────────────────────────────────
    // Any route that CREATES content requires authentication.
    // People can browse/view everything — but posting, listing, commenting,
    // or creating any profile requires sign-in.
    const PROTECTED_PREFIXES = [
        // Profiles & account
        '/profile',
        '/my-profile',
        '/my-barangay',        // calamity/new, lost-found/new, etc.
        // Marketplace
        '/marketplace/create',
        '/create-new-listing',
        // Jobs
        '/create-new-job-post-screen',
        '/jobs/create',
        // Events
        '/events/create',
        '/create-event-post-screen',
        // Business directory
        '/directory/create',
        '/create-business-profile-step1',
        '/create-business-profile-step2',
        '/create-business-profile-step3',
        '/claim-business',
        // Transport & boats
        '/commute/create',
        '/post-commute-or-delivery-listing',
        '/island-hopping/list',
        // Gems / community
        '/gems/create',
        '/community/create',
        // Island life reporting
        '/island-life/outages/new',
        '/post',
    ];

    const isProtectedRoute = PROTECTED_PREFIXES.some(prefix =>
        request.nextUrl.pathname.startsWith(prefix)
    );

    if (isProtectedRoute && !user) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return response
}

export const config = {
    // Ignore static files and images so the middleware runs fast
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
