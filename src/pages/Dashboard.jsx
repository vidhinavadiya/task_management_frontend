import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { CheckSquare, Users } from 'lucide-react';
import API from '../api/axios';           // ← Use this instead of raw axios
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const fetchDashboard = async () => {
        try {
            const res = await API.get('/dashboard');        // ← Fixed
            setDashboardData(res.data.data);
        } catch (err) {
            console.error("Dashboard Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredTasks = async (status = null) => {
        try {
            const params = status ? { status } : {};
            const res = await API.get('/tasks', { params });   // ← Fixed
            setTasks(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchFilteredTasks();
    }, []);

    if (loading) {
        return <div className="text-center py-20 text-zinc-400">Loading Dashboard...</div>;
    }

    const stats = dashboardData?.summary || {};
    const charts = dashboardData?.charts || {};

    const taskStatusData = [
        { name: 'Completed', value: stats.completedTasks || 0, color: '#10b981', key: 'Completed' },
        { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#3b82f6', key: 'In Progress' },
        { name: 'Pending', value: stats.pendingTasks || 0, color: '#f59e0b', key: 'Pending' },
    ].filter(item => item.value > 0);

    const totalTasks = stats.totalTasks || 0;

    const handleStatusClick = (statusKey) => {
        setSelectedStatus(statusKey);
        fetchFilteredTasks(statusKey);
    };

    return (
        <div className="p-6 md:p-10 bg-zinc-950 min-h-screen text-white">
            <div className="max-w-7xl mx-auto">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="Total Tasks" value={stats.totalTasks || 0} icon={CheckSquare} color="violet" />
                    <StatCard title="Completed" value={stats.completedTasks || 0} icon={CheckSquare} color="emerald" />
                    <StatCard title="In Progress" value={stats.inProgressTasks || 0} icon={Users} color="blue" />
                    <StatCard title="Pending" value={stats.pendingTasks || 0} icon={Users} color="rose" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Donut Chart */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                        <h3 className="text-2xl font-semibold mb-8">Project Analytics</h3>
                        
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="relative w-64 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taskStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={85}
                                            outerRadius={120}
                                            dataKey="value"
                                        >
                                            {taskStatusData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.color} 
                                                    onClick={() => handleStatusClick(entry.key)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <p className="text-zinc-400 text-sm">Total Tasks</p>
                                    <p className="text-5xl font-bold text-white">{totalTasks}</p>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <h4 className="font-semibold text-lg mb-4">Status Breakdown</h4>
                                {taskStatusData.map((item, index) => (
                                    <div 
                                        key={index} 
                                        onClick={() => handleStatusClick(item.key)}
                                        className="flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 rounded-2xl p-4 cursor-pointer transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                            <span className="text-white">{item.name}</span>
                                        </div>
                                        <div className="font-semibold">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent / Filtered Tasks */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">
                                {selectedStatus ? `${selectedStatus} Tasks` : 'Recent Tasks'}
                            </h3>
                            {selectedStatus && (
                                <button 
                                    onClick={() => { setSelectedStatus(null); fetchFilteredTasks(); }} 
                                    className="text-violet-400 text-sm hover:underline"
                                >
                                    Show All
                                </button>
                            )}
                        </div>

                        <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-3 pr-2">
                            {tasks.length === 0 ? (
                                <p className="text-zinc-400 text-center py-10">No tasks found</p>
                            ) : (
                                tasks.slice(0, 8).map(task => (
                                    <div key={task.id} className="bg-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-sm text-zinc-500">{task.status}</p>
                                        </div>
                                        <span className="text-xs bg-zinc-700 px-3 py-1 rounded-full">
                                            {task.priority}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}