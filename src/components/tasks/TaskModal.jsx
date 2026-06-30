import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, task = null }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending'
    });

    const [errors, setErrors] = useState({});

    // Reset form when modal opens or task changes
    useEffect(() => {
        if (isOpen) {
            if (task) {
                setFormData({
                    title: task.title,
                    description: task.description || '',
                    priority: task.priority,
                    status: task.status,
                });
            } else {
                setFormData({
                    title: '',
                    description: '',
                    priority: 'Medium',
                    status: 'Pending',
                });
            }
            setErrors({}); // Clear errors
        }
    }, [isOpen, task]);

    // Client-side Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Task title is required";
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters long";
        }

        if (!formData.priority) {
            newErrors.priority = "Please select priority";
        }

        if (!formData.status) {
            newErrors.status = "Please select status";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return; // Stop here - don't call onSave and don't close modal
        }

        // If valid → call onSave
        onSave(formData);
        onClose(); // Only close if successful
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };
    

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-lg mx-4">
                <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                    <h2 className="text-2xl font-semibold text-white">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Task Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none ${
                                errors.title ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-zinc-400 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div>
                            <label className="block text-zinc-400 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white ${
                                    errors.priority ? 'border-red-500' : 'border-zinc-700'
                                }`}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-zinc-400 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white ${
                                    errors.status ? 'border-red-500' : 'border-zinc-700'
                                }`}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>
                    </div>
                    

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white font-medium transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl text-white font-medium transition-all"
                        >
                            {task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}