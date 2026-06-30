import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const initialState = {
    type: 'yearly',
    targetAmount: ''
};

export default function TargetModal({ isOpen, onClose, onSave, existingTargets = [] }) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialState);
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.targetAmount || formData.targetAmount <= 0) {
            newErrors.targetAmount = "Target amount must be greater than 0";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                    <h2 className="text-2xl font-semibold text-white">Add New Target</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-zinc-400 mb-2">Target Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white"
                        >
                            <option value="daily">Daily Target</option>
                            <option value="monthly">Monthly Target</option>
                            <option value="yearly">Yearly Target</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-zinc-400 mb-2">Target Amount (₹)</label>
                        <input
                            type="number"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white ${errors.targetAmount ? 'border-red-500' : 'border-zinc-700'}`}
                            placeholder="Enter amount"
                        />
                        {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
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
                            Add Target
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}