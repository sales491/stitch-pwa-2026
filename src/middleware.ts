import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

    // Protect private routes here! Add any routes you want to lock down.
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/admin') ||
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
