'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'

type Profile = {
    id: string
    full_name: string
    avatar_url: string
    role: 'user' | 'moderator' | 'admin' | 'business'
}

type AuthContextType = {
    user: User | null
    profile: Profile | null
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Initialize the Supabase client for the browser
    const [supabase] = useState(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ))

    useEffect(() => {
        async function loadUser() {
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                setUser(session.user)

                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (profileData) {
                    setProfile(profileData)
                } else {
                    if (error) console.log("Did not find public profile row, generating fallback dynamically.");
                    // Fallback to essential profile fields in case the database trigger hasn't fired yet
                    // or if the user is a legacy account without a profile row.

                    const safeEmail = session.user.email || '';
                    const defaultName = safeEmail ? safeEmail.split('@')[0] : 'PH';

                    setProfile({
                        id: session.user.id,
                        full_name: session.user.user_metadata?.full_name || defaultName,
                        avatar_url: session.user.user_metadata?.avatar_url || '',
                        role: 'user'
                    })
                }
            } else {
                setUser(null)
                setProfile(null)
            }
            setIsLoading(false)
        }

        loadUser()

        // Listen for login/logout events and update instantly
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            loadUser()
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    return (
        <AuthContext.Provider value={{ user, profile, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use anywhere in your app
export const useAuth = () => useContext(AuthContext)
