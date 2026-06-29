export default function Navbar() {
    return (
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 px-8 flex items-center justify-between">
            <div className="text-xl font-semibold text-white">Dashboard</div>
            
            <div className="flex items-center gap-4">
                <div className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-2xl text-sm">
                    Welcome, Admin
                </div>
            </div>
        </div>
    );
}