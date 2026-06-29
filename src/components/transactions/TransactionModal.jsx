import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, onSave, transaction = null }) {
    const [formData, setFormData] = useState({
        amount: '',
        type: 'INCOME',
        category: '',
        note: '',
        transactionDate: new Date().toISOString().split('T')[0]
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                setFormData({
                    amount: transaction.amount,
                    type: transaction.type,
                    category: transaction.category,
                    note: transaction.note || '',
                    transactionDate: transaction.transactionDate
                });
            } else {
                setFormData({
                    amount: '',
                    type: 'INCOME',
                    category: '',
                    note: '',
                    transactionDate: new Date().toISOString().split('T')[0]
                });
            }
            setErrors({});
        }
    }, [isOpen, transaction]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Amount must be greater than 0";
        }
        if (!formData.category.trim()) {
            newErrors.category = "Category is required";
        }
        if (!formData.transactionDate) {
            newErrors.transactionDate = "Transaction date is required";
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

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b border-zinc-700">
                    <h2 className="text-2xl font-semibold text-white">
                        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </h2>
                    <button onClick={handleClose} className="text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-zinc-400 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none ${
                                errors.amount ? 'border-red-500' : 'border-zinc-700'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                        <label className="block text-zinc-400 mb-2">Type</label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${formData.type === 'INCOME' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                                className={`flex-1 py-3 rounded-2xl font-medium transition-all ${formData.type === 'EXPENSE' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                            >
                                Expense
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-400 mb-2">Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none ${
                                errors.category ? 'border-red-500' : 'border-zinc-700'
                            }`}
                            placeholder="e.g. Salary, Food, Rent"
                        />
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-zinc-400 mb-2">Note (Optional)</label>
                        <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows={2}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-zinc-400 mb-2">Transaction Date</label>
                        <input
                            type="date"
                            value={formData.transactionDate}
                            onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                            className={`w-full bg-zinc-800 border rounded-2xl px-5 py-3 text-white focus:border-violet-500 outline-none ${
                                errors.transactionDate ? 'border-red-500' : 'border-zinc-700'
                            }`}
                        />
                        {errors.transactionDate && <p className="text-red-500 text-sm mt-1">{errors.transactionDate}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl text-white font-medium"
                        >
                            {transaction ? 'Update Transaction' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}