import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { path: '/admin/projects', label: 'Projects', icon: LayoutDashboard },
        { path: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/admin/transactions', label: 'Transactions', icon: TrendingUp },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger Button - Right Side */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 right-4 z-50 p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl border border-zinc-700 text-white transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`w-72 bg-zinc-950 border-r border-zinc-800 h-screen flex flex-col fixed transition-all duration-300 z-40
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">ND</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Dhrumil</h1>
                            <p className="text-xs text-zinc-500">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={closeSidebar}
                                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                                            : 'hover:bg-zinc-900 text-zinc-300 hover:text-white'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={() => {
                            handleLogout();
                            closeSidebar();
                        }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-zinc-900 rounded-2xl transition-all hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 z-30"
                    onClick={closeSidebar}
                />
            )}
        </>
    );
}