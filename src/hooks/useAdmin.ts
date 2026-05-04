'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export const useAdmin = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const supabase = createClient()
        const checkAdmin = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    setIsAdmin(false)
                    setLoading(false)
                    return
                }

                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (error) throw error

                setIsAdmin(profile?.role === 'admin')
            } catch (err) {
                console.error('Error checking admin status:', err)
                setIsAdmin(false)
            } finally {
                setLoading(false)
            }
        }

        checkAdmin()
    }, [])

    return { isAdmin, loading }
}
