export default function StatCard({ title, value, icon: Icon, color = "violet" }) {
    const colorClasses = {
        violet: "text-violet-400 bg-violet-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        blue: "text-blue-400 bg-blue-500/10",        // ← Added this
        amber: "text-amber-400 bg-amber-500/10",
        rose: "text-rose-400 bg-rose-500/10"
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-violet-500/30 transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-zinc-400 text-sm">{title}</p>
                    <p className="text-4xl font-bold mt-3 tracking-tighter">{value}</p>
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses[color] || colorClasses.violet}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    );
}