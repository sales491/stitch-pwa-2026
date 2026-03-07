export default function LeftSidebar() {
    return (
        <nav className="p-4 h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-blue-600 mb-6">Marinduque Hub</h1>
            {/* Navigation Links */}
            <a href="/marketplace" className="p-3 hover:bg-gray-100 rounded-lg font-medium">🛒 Marketplace</a>
            <a href="/directory" className="p-3 hover:bg-gray-100 rounded-lg font-medium">🏪 Business Directory</a>
            <a href="/jobs" className="p-3 hover:bg-gray-100 rounded-lg font-medium">💼 Jobs</a>
            <a href="/events" className="p-3 hover:bg-gray-100 rounded-lg font-medium">📅 Events</a>

            {/* Spacer to push user profile to the bottom */}
            <div className="flex-grow"></div>

            {/* We will plug the Auth User Profile here later! */}
            <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-semibold">User Profile Placeholder</p>
            </div>
        </nav>
    );
}
