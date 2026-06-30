import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const initialState = {
    projectName: '',
    clientName: '',
    description: '',
    budget: '',
    status: 'Planning',
    // dueDate removed
};

export default function ProjectModal({ isOpen, onClose, onSave, project = null }) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (project) {
                setFormData({
                    projectName: project.projectName || '',
                    clientName: project.clientName || '',
                    description: project.description || '',
                    budget: project.budget || '',
                    status: project.status || 'Planning',
                });
            } else {
                setFormData({ ...initialState });
            }
            setErrors({});
        }
    }, [isOpen, project]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName?.trim()) newErrors.projectName = "Project name is required";
        if (!formData.clientName?.trim()) newErrors.clientName = "Client name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave(formData);   // dueDate nahi bhej rahe
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg mx-4">
                
                <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                    <h2 className="text-2xl font-semibold text-white">
                        {project ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Project Name */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Project Name</label>
                        <input
                            value={formData.projectName}
                            onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white ${errors.projectName ? 'border-red-500' : 'border-zinc-700'}`}
                        />
                        {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
                    </div>

                    {/* Client Name */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Client Name</label>
                        <input
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white ${errors.clientName ? 'border-red-500' : 'border-zinc-700'}`}
                        />
                        {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
                        />
                    </div>

                    {/* Budget */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Budget</label>
                        <input
                            type="number"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
                            placeholder="Enter budget amount"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
                        >
                            <option value="Planning">Planning</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl text-white"
                        >
                            {project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}