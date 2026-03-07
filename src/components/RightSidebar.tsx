export default function RightSidebar() {
    return (
        <aside className="p-4 h-full flex flex-col gap-6 overflow-y-auto">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-2">⛴️ Port Updates</h3>
                <p className="text-sm text-gray-500">Crowdsourced updates will go here.</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex-grow">
                <h3 className="font-bold text-blue-800 mb-2">Sponsored Ad Space</h3>
                <p className="text-sm text-blue-600">Future monetization goes here.</p>
            </div>
        </aside>
    );
}
