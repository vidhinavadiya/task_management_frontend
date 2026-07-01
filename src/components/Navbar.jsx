export default function Navbar() {
    return (
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 lg:px-8 py-4 lg:py-0 min-h-[64px] flex items-center">
            <div className="flex flex-col lg:flex-row w-full lg:items-center lg:justify-between gap-y-3 lg:gap-y-0">
                
                {/* Left Side - Dashboard Title */}
                <div className="text-lg sm:text-xl font-semibold text-white">
                    Dashboard
                </div>

                {/* Right Side - Welcome */}
                <div className="flex items-center">
                    <div className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-2xl text-sm whitespace-nowrap">
                        Welcome, Dhrumil
                    </div>
                </div>

            </div>
        </div>
    );
}