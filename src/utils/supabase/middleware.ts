import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdmin } from '../roles'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // --- Route Protection Logic ---
    const currentPath = request.nextUrl.pathname;

    // Define paths that require authentication
    const protectedPaths = [
        '/create-new-job-post-screen',
        '/create-business-profile-step1',
        '/create-business-profile-step2',
        '/create-business-profile-step3',
        '/post-commute-or-delivery-listing',
        '/create-new-listing',
        '/claim-business',
        '/create-event-post-screen',
        '/share-alocal-gem-screen',
    ];

    const isProtectedPath = protectedPaths.some((path) => currentPath.startsWith(path));

    // If there's no user and the route is protected, redirect to login
    if (!user && isProtectedPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return { response: NextResponse.redirect(url), user }
    }

    // --- Admin Route Protection Logic ---
    if (currentPath.startsWith('/admin')) {
        if (!user || !isAdmin(user.email)) {
            const url = request.nextUrl.clone();
            url.pathname = '/marinduque-connect-home-feed';
            return { response: NextResponse.redirect(url), user };
        }
    }

    return { response: supabaseResponse, user }
}
