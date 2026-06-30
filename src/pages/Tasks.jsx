import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import TaskModal from '../components/tasks/TaskModal';
import { Plus, Edit2, Trash2, CheckSquare, Users } from 'lucide-react';
import StatCard from '../components/StatCard';
import API from '../api/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [deleteTaskId, setDeleteTaskId] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);
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

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10, search, status: statusFilter, priority: priorityFilter };
            const res = await taskService.getAllTasks(params);
            
            setTasks(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const openAddModal = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

const handleSaveTask = async (formData) => {
    try {
        if (editingTask) {
            await taskService.updateTask(editingTask.id, formData);
        } else {
            await taskService.createTask(formData);
        }
        fetchTasks();           // Refresh list
        // Optional: Show success toast
    } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || err.message || "Something went wrong";
        alert(message);   // You can replace with toast later
    }
};

const handleStatusChange = async (id, status) => {

    try {

        await taskService.updateTaskStatus(id, status);

        fetchTasks();

    } catch (err) {

        alert(
            err.response?.data?.message ||
            "Failed to update status"
        );

    }

};

    const handleDelete = async () => {
        if (!deleteTaskId) return;
        try {
            await taskService.deleteTask(deleteTaskId);
            fetchTasks();
            setDeleteTaskId(null);
        } catch (err) {
            alert(err.message || "Failed to delete task");
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Completed') return 'bg-emerald-500/20 text-emerald-400';
        if (status === 'In Progress') return 'bg-amber-500/20 text-amber-400';
        return 'bg-zinc-500/20 text-zinc-400';
    };


    useEffect(() => {
        fetchDashboard();
        fetchFilteredTasks();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [page, search, statusFilter, priorityFilter]);

    if (loading) {
        return <div className="text-center py-20 text-zinc-400">Loading Dashboard...</div>;
    }

    return (

        
        <div className="space-y-6">

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

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Tasks Management</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 rounded-2xl text-white font-medium hover:brightness-110 transition-all"
                >
                    <Plus size={20} />
                    Add New Task
                </button>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={handleSearch}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white w-full md:w-80 focus:outline-none focus:border-violet-500"
                />

                <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white">
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white">
                    <option value="">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>

                <button onClick={() => { setSearch(''); setStatusFilter(''); setPriorityFilter(''); setPage(1); }} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white">
                    Clear Filters
                </button>
            </div>

            {/* Tasks Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-6 text-zinc-400 font-medium">Task</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Priority</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Status</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Due Date</th>
                            <th className="text-center p-6 text-zinc-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-zinc-400">Loading tasks...</td></tr>
                        ) : tasks.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-zinc-400">No tasks found</td></tr>
                        ) : (
                            tasks.map(task => (
                                <tr key={task.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-all">
                                    <td className="p-6">
                                        <div className="font-medium text-white">{task.title}</div>
                                        {task.description && <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{task.description}</p>}
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-4 py-1 rounded-full text-sm ${task.priority === 'High' ? 'bg-red-500/20 text-red-400' : task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <select
    value={task.status}
    onChange={(e)=>handleStatusChange(task.id,e.target.value)}
    className={`px-3 py-2 rounded-xl border-0 outline-none cursor-pointer ${getStatusColor(task.status)}`}
>

    <option value="Pending">
        Pending
    </option>

    <option value="In Progress">
        In Progress
    </option>

    <option value="Completed">
        Completed
    </option>

</select>
                                    </td>
                                    <td className="p-6 text-zinc-400">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN') : 'No Due Date'}
                                    </td>
                                    <td className="p-6 text-center space-x-4">
                                        <button onClick={() => openEditModal(task)} className="text-violet-400 hover:text-violet-500">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => setDeleteTaskId(task.id)} className="text-red-400 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-6">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl disabled:opacity-50">Previous</button>
                    <span className="px-6 py-3 bg-zinc-900 rounded-2xl text-zinc-400">Page {page} of {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl disabled:opacity-50">Next</button>
                </div>
            )}

            {/* Task Modal */}
            <TaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveTask} 
                task={editingTask} 
            />

            {/* Delete Confirmation Modal */}
            {deleteTaskId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full mx-4 text-center">
                        <h3 className="text-xl font-semibold text-white mb-4">Delete Task?</h3>
                        <p className="text-zinc-400 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteTaskId(null)} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}