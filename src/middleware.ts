import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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
    // Protect private routes here! Add any routes you want to lock down.
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/post');

    if (isProtectedRoute && !user) {
        // Kick them back to the login page
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}

export const config = {
    // Ignore static files and images so the middleware runs fast
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
