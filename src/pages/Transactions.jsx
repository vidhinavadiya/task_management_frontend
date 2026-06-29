import { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';
import TransactionModal from '../components/transactions/TransactionModal';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                search,
                type: typeFilter,
                category: categoryFilter
            };

            const res = await transactionService.getAllTransactions(params);
            setTransactions(res.data);
            setPagination(res.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, search, typeFilter, categoryFilter]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const openAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

const handleSave = async (formData) => {
    try {
        if (editingTransaction) {
            await transactionService.updateTransaction(editingTransaction.id, formData);
        } else {
            await transactionService.createTransaction(formData);
        }
        fetchTransactions();   // Refresh list
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || err.message || "Operation failed");
    }
};

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await transactionService.deleteTransaction(deleteId);
            fetchTransactions();
            setDeleteId(null);
        } catch (err) {
            alert(err.message || "Failed to delete");
        }
    };

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Income & Expense</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 rounded-2xl text-white font-medium hover:brightness-110 transition-all"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6">
                    <div className="flex items-center gap-3 text-emerald-400 mb-2">
                        <TrendingUp size={24} />
                        <span className="font-medium">Total Income</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</p>
                </div>

                <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-6">
                    <div className="flex items-center gap-3 text-red-400 mb-2">
                        <TrendingDown size={24} />
                        <span className="font-medium">Total Expense</span>
                    </div>
                    <p className="text-3xl font-bold text-red-400">₹{totalExpense.toFixed(2)}</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">
                    <div className="text-zinc-400 mb-2">Net Balance</div>
                    <p className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ₹{(totalIncome - totalExpense).toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by category or note..."
                    value={search}
                    onChange={handleSearch}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white w-full md:w-80 focus:outline-none focus:border-violet-500"
                />

                <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white">
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

                <button onClick={() => { setSearch(''); setTypeFilter(''); setCategoryFilter(''); setPage(1); }} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-white">
                    Clear
                </button>
            </div>

            {/* Transactions Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-800">
                            <th className="text-left p-6 text-zinc-400">Date</th>
                            <th className="text-left p-6 text-zinc-400">Category</th>
                            <th className="text-left p-6 text-zinc-400">Note</th>
                            <th className="text-right p-6 text-zinc-400">Amount</th>
                            <th className="text-center p-6 text-zinc-400">Type</th>
                            <th className="text-center p-6 text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-20 text-zinc-400">Loading...</td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-20 text-zinc-400">No transactions found</td></tr>
                        ) : (
                            transactions.map(t => (
                                <tr key={t.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                    <td className="p-6 text-zinc-400">{new Date(t.transactionDate).toLocaleDateString('en-IN')}</td>
                                    <td className="p-6 font-medium text-white">{t.category}</td>
                                    <td className="p-6 text-zinc-500">{t.note || '-'}</td>
                                    <td className={`p-6 text-right font-semibold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        ₹{parseFloat(t.amount).toFixed(2)}
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className={`px-4 py-1 rounded-full text-sm ${t.type === 'INCOME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center space-x-4">
                                        <button onClick={() => openEditModal(t)} className="text-violet-400 hover:text-violet-500">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => setDeleteId(t.id)} className="text-red-400 hover:text-red-500">
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
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-6 py-3 bg-zinc-900 rounded-2xl disabled:opacity-50">Previous</button>
                    <span className="px-6 py-3 bg-zinc-900 rounded-2xl">Page {page} of {pagination.totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(pagination.totalPages, p+1))} disabled={page === pagination.totalPages} className="px-6 py-3 bg-zinc-900 rounded-2xl disabled:opacity-50">Next</button>
                </div>
            )}

            {/* Modals */}
            <TransactionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                transaction={editingTransaction} 
            />

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-sm w-full text-center">
                        <h3 className="text-xl font-semibold mb-4">Delete Transaction?</h3>
                        <p className="text-zinc-400 mb-8">This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setDeleteId(null)} className="flex-1 py-4 bg-zinc-800 rounded-2xl">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-4 bg-red-600 rounded-2xl text-white">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}