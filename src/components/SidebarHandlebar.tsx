'use client'

import { useAuth } from './AuthProvider'
import Link from 'next/link'

export default function SidebarHandlebar() {
    const { profile, isLoading } = useAuth()

    return (
        <nav className="p-4 h-full flex flex-col gap-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Marinduque Hub</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Digital Town Square</p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
                <Link href="/marketplace" className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold transition-colors flex items-center gap-3">
                    <span>🛒</span> Marketplace
                </Link>
                <Link href="/directory" className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold transition-colors flex items-center gap-3">
                    <span>🏪</span> Directory
                </Link>
                <Link href="/jobs" className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold transition-colors flex items-center gap-3">
                    <span>💼</span> Jobs
                </Link>
                <Link href="/events" className="p-3 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-semibold transition-colors flex items-center gap-3">
                    <span>📅</span> Events
                </Link>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* User Profile Section */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                {isLoading ? (
                    <div className="animate-pulse flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                ) : profile ? (
                    <div className="flex items-center gap-3">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                {profile.full_name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{profile.full_name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-tight font-bold">{profile.role}</p>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center justify-center p-2 bg-primary text-black font-bold rounded-xl text-sm transition-transform active:scale-95">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    )
}
