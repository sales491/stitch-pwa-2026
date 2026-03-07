export default function MobileBottomNav() {
    return (
        <nav className="flex justify-around items-center h-16 pb-safe">
            {/* pb-safe ensures the nav doesn't hide behind the iPhone home bar 
        You might need a Tailwind plugin for safe-area-insets later
      */}
            <a href="/" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
                <span className="text-xl">🏠</span>
                <span className="text-[10px] font-medium mt-1">Home</span>
            </a>
            <a href="/marketplace" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
                <span className="text-xl">🛒</span>
                <span className="text-[10px] font-medium mt-1">Shop</span>
            </a>
            <a href="/post" className="flex flex-col items-center p-2 text-blue-600">
                <div className="bg-blue-100 rounded-full p-2 -mt-6 border-4 border-white">
                    <span className="text-2xl">➕</span>
                </div>
            </a>
            <a href="/directory" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
                <span className="text-xl">🏪</span>
                <span className="text-[10px] font-medium mt-1">Local</span>
            </a>
            <a href="/profile" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
                <span className="text-xl">👤</span>
                <span className="text-[10px] font-medium mt-1">Account</span>
            </a>
        </nav>
    );
}
