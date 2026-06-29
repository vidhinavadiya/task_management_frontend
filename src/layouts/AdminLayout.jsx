import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-zinc-950">
            <Sidebar />
            
            <div className="flex-1 flex flex-col ml-72">
                <Navbar />
                <main className="flex-1 overflow-auto p-6 md:p-8 lg:p-10 bg-zinc-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}