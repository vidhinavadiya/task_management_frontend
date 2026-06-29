import { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onSubmit, error }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <div className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-700 rounded-3xl p-10 shadow-2xl">
            <h2 className="text-3xl font-semibold text-white mb-2">Sign In</h2>
            <p className="text-zinc-400 mb-8">Access your admin dashboard</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-2xl mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label className="text-zinc-400 text-sm block mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 text-white focus:outline-none focus:border-violet-500 transition-all placeholder:text-zinc-500"
                            placeholder="admin@company.com"
                        />
                    </div>
                </div>

                {/* Password Field with Toggle */}
                <div>
                    <label className="text-zinc-400 text-sm block mb-2">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-violet-500 transition-all placeholder:text-zinc-500"
                            placeholder="••••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:brightness-110 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? "Signing In..." : "Sign In"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}