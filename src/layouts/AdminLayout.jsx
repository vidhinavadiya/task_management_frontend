import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden">
            <Sidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-72 transition-all duration-300">
                <Navbar />
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-zinc-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}