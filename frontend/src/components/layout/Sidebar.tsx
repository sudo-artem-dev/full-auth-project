export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-900 text-white h-full p-6 space-y-4">
            <h2 className="text-xl font-bold">Sidebar</h2>

            <nav className="space-y-2">
                <a
                    href="/test"
                    className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                    Page Test
                </a>
            </nav>
        </aside>
    );
}
