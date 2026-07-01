import { useState, useEffect } from 'react';
import { Plus, Users, CheckSquare, Edit2, Trash2 } from 'lucide-react';
import projectService from '../services/projectService';
import targetService from '../services/targetService';
import ProjectModal from '../components/projects/ProjectModal';
import TargetModal from '../components/projects/TargetModal';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import API from '../api/axios';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deleteProjectId, setDeleteProjectId] = useState(null);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

    // Dashboard Data
    const [dashboardData, setDashboardData] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // Fetch Dashboard
    const fetchDashboard = async () => {
        try {
            const res = await API.get('/dashboard');
            setDashboardData(res.data.data || res.data);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setDashboardData({ summary: {} });
        }
    };

    // Fetch Projects (Important: statusFilter use karega)
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = { 
                page, 
                limit: 10, 
                search, 
                status: statusFilter 
            };
            const res = await projectService.getAllProjects(params);
            setProjects(res.data || []);
            setPagination(res.pagination || {});
        } catch (err) {
            console.error("Error fetching projects:", err);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = dashboardData?.summary || {};

    const chartData = [
        { name: 'Completed', value: stats.completedProjects || 0, color: '#10b981', key: 'Completed' },
        { name: 'In Progress', value: stats.inProgressProjects || 0, color: '#3b82f6', key: 'In Progress' },
        { name: 'Planning', value: stats.planningProjects || 0, color: '#f59e0b', key: 'Planning' },
        { name: 'On Hold', value: stats.onHoldProjects || 0, color: '#ef4444', key: 'On Hold' },
    ].filter(item => item.value > 0);

    const totalProjects = stats.totalProjects || 0;

    // Target Stats
    const targetStats = {
    targetAmount: stats.budget?.targetAmount || 0,
    achievedAmount: stats.budget?.achievedAmount || 0,
    remainingAmount: stats.budget?.remainingAmount || 0,
    progressPercentage: stats.budget?.progressPercentage || 0
};

    // Handle Status Click (Pie + Breakdown)
    const handleStatusClick = (statusKey) => {
        setSelectedStatus(statusKey);
        setStatusFilter(statusKey);
        setPage(1);
    };

    // CRUD
    const handleSaveProject = async (formData) => {
        try {
            if (editingProject) {
                await projectService.updateProject(editingProject.id, formData);
            } else {
                await projectService.createProject(formData);
            }
            fetchProjects();
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await projectService.updateProjectStatus(id, status);
            fetchProjects();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const handleDelete = async () => {
        if (!deleteProjectId) return;
        try {
            await projectService.deleteProject(deleteProjectId);
            fetchProjects();
            setDeleteProjectId(null);
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleAddTarget = async (data) => {
        try {
            await targetService.createTarget(data);
            fetchDashboard();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add target");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/20 text-emerald-400';
            case 'In Progress': return 'bg-blue-500/20 text-blue-400';
            case 'On Hold': return 'bg-red-500/20 text-red-400';
            default: return 'bg-amber-500/20 text-amber-400';
        }
    };

    // Effects
    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [page, search, statusFilter]);

    return (
        <div className="space-y-6 p-6 md:p-10 bg-zinc-950 min-h-screen text-white">
            

            {/* ==================== TARGET BUDGET PROGRESS ==================== */}
<div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
    <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold">Budget Target Progress</h3>

        <button
            onClick={() => setIsTargetModalOpen(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 transition px-5 py-3 rounded-2xl text-sm font-medium"
        >
            <Plus size={18} />
            Add Target
        </button>
    </div>

    <div className="flex flex-col xl:flex-row items-center gap-14">

        {/* Progress Circle */}
        <div className="relative w-72 h-72 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={[
                            {
                                name: "Achieved",
                                value: targetStats.achievedAmount,
                                fill: "#22c55e",
                            },
                            {
                                name: "Remaining",
                                value: targetStats.remainingAmount,
                                fill: "#3f3f46",
                            },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={95}
                        outerRadius={125}
                        dataKey="value"
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-zinc-400 text-sm">
                    Progress
                </p>

                <h2 className="text-5xl font-bold">
                    {targetStats.progressPercentage}%
                </h2>
            </div>
        </div>

        {/* Details */}
        <div className="flex-1 w-full space-y-8">

            <div>
                <div className="flex justify-between mb-3">
                    <span className="text-zinc-400">
                        Yearly Target
                    </span>

                    <span className="font-semibold text-lg">
                        ₹{Number(targetStats.targetAmount).toLocaleString("en-IN")}
                    </span>
                </div>

                <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                        style={{
                            width: `${targetStats.progressPercentage}%`,
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-zinc-800 rounded-2xl p-6">
                    <p className="text-sm text-emerald-400 mb-2">
                        Achieved
                    </p>

                    <h2 className="text-3xl font-bold">
                        ₹{Number(targetStats.achievedAmount).toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6">
                    <p className="text-sm text-amber-400 mb-2">
                        Remaining
                    </p>

                    <h2 className="text-3xl font-bold">
                        ₹{Number(targetStats.remainingAmount).toLocaleString("en-IN")}
                    </h2>
                </div>

            </div>

        </div>

    </div>
</div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Projects" value={totalProjects} icon={CheckSquare} color="violet" />
                <StatCard title="Completed" value={stats.completedProjects || 0} icon={CheckSquare} color="emerald" />
                <StatCard title="In Progress" value={stats.inProgressProjects || 0} icon={Users} color="blue" />
                <StatCard title="Planning" value={stats.planningProjects || 0} icon={Users} color="amber" />
            </div>

            {/* Analytics Section */}
            {/* Analytics + Recent Projects Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <h3 className="text-2xl font-semibold mb-8">Project Analytics</h3>
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative w-64 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={85}
                                        outerRadius={120}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
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
                                <p className="text-zinc-400 text-sm">Total Projects</p>
                                <p className="text-5xl font-bold text-white">{totalProjects}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h4 className="font-semibold text-lg mb-4">Status Breakdown</h4>
                            {chartData.map((item, index) => (
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

                {/* Recent Projects */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">
                            {selectedStatus ? `${selectedStatus} Projects` : 'Recent Projects'}
                        </h3>
                        {selectedStatus && (
                            <button 
                                onClick={() => { 
                                    setSelectedStatus(null); 
                                    setStatusFilter(''); 
                                    setPage(1); 
                                }} 
                                className="text-violet-400 text-sm hover:underline"
                            >
                                Show All
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto scrollbar-hide space-y-3 pr-2">
                        {projects.length === 0 ? (
                            <p className="text-zinc-400 text-center py-10">No projects found</p>
                        ) : (
                            projects.slice(0, 8).map(project => (
                                <div key={project.id} className="bg-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{project.projectName}</p>
                                        <p className="text-sm text-zinc-500">{project.clientName}</p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>


            {/* Header + Add Button */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Projects Management</h1>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 rounded-2xl hover:brightness-110 transition-all"
                >
                    <Plus size={20} />
                    Add New Project
                </button>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white w-full md:w-80 focus:outline-none focus:border-violet-500"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
                >
                    <option value="">All Status</option>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                </select>

                <button 
                    onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
                    className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
                >
                    Clear Filters
                </button>
            </div>

            {/* Projects Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-6 text-zinc-400 font-medium">Project</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Client</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Status</th>
                            <th className="text-left p-6 text-zinc-400 font-medium">Date</th>
                            <th className="text-center p-6 text-zinc-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-20 text-zinc-400">Loading projects...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-20 text-zinc-400">No projects found</td></tr>
                        ) : (
                            projects.map(project => (
                                <tr key={project.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-all">
                                    <td className="p-6">
                                        <div className="font-medium text-white">{project.projectName}</div>
                                        {project.description && <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{project.description}</p>}
                                    </td>
                                    <td className="p-6 text-zinc-400">{project.clientName}</td>
                                    <td className="p-6">
                                        <select
                                            value={project.status}
                                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                            className={`px-4 py-2 rounded-xl border-0 outline-none cursor-pointer ${getStatusColor(project.status)}`}
                                        >
                                            <option value="Planning">Planning</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </td>
                                    <td className="p-6 text-zinc-400">
                                        {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-IN') : 'No Due Date'}
                                    </td>
                                    <td className="p-6 text-center space-x-4">
                                        <button onClick={() => { setEditingProject(project); setIsModalOpen(true); }} className="text-violet-400 hover:text-violet-500">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => setDeleteProjectId(project.id)} className="text-red-400 hover:text-red-500">
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

            {/* Modal */}
            <ProjectModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveProject} 
                project={editingProject} 
            />
              <TargetModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                onSave={handleAddTarget}
            />

            {/* Delete Confirmation */}
            {deleteProjectId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full mx-4 text-center">
                        <h3 className="text-xl font-semibold mb-4">Delete Project?</h3>
                        <p className="text-zinc-400 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteProjectId(null)} className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-2xl text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}