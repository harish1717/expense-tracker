import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ConfirmModal from '../components/ConfirmModal';
import { useState as useStateAlias } from 'react';
import TransactionForm from '../components/TransactionForm';
import BudgetAlert from '../components/BudgetAlert';
import { CATEGORIES } from '../components/TransactionForm';

const COLORS = ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d', '#b45309', '#ea580c', '#f97316', '#92400e'];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await api.get('/transactions');
    setTransactions(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleAddOrEdit = async (data) => {
    if (editing) {
      await api.put(`/transactions/${editing._id}`, data);
    } else {
      await api.post('/transactions', data);
    }
    setShowForm(false);
    setEditing(null);
    fetchTransactions();
  };

  const handleDelete = (id) => {
  setDeleteId(id);
};

const confirmDelete = async () => {
  await api.delete(`/transactions/${deleteId}`);
  setDeleteId(null);
  fetchTransactions();
};

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        search.trim() === '' ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.note && t.note.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const categoryData = Object.values(
    transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
      acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
      acc[t.category].value += t.amount;
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <BudgetAlert />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
              <p className="text-sm text-neutral-500">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-neutral-900 dark:text-white' : 'text-red-500'}`}>₹{balance.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5 border-l-4 border-green-500">
              <p className="text-sm text-neutral-500">Income</p>
              <p className="text-2xl font-bold text-green-500">₹{income.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5 border-l-4 border-red-500">
              <p className="text-sm text-neutral-500">Expenses</p>
              <p className="text-2xl font-bold text-red-500">₹{expense.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Transactions</h2>
            <button
              onClick={() => { setEditing(null); setShowForm(true); }}
              className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + Add Transaction
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by category or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800">
              {loading ? (
                <p className="p-6 text-neutral-400 text-sm">Loading...</p>
              ) : filteredTransactions.length === 0 ? (
                <p className="p-6 text-neutral-400 text-sm">
                  {transactions.length === 0 ? 'No transactions yet. Add your first one!' : 'No transactions match your filters.'}
                </p>
              ) : (
                filteredTransactions.map((t) => (
                  <div key={t._id} className="flex justify-between items-center p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">{t.category}</p>
                      <p className="text-xs text-neutral-400">{new Date(t.date).toLocaleDateString()} {t.note && `· ${t.note}`}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => { setEditing(t); setShowForm(true); }}
                        className="text-xs text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-2">Spending by Category</p>
              {categoryData.length === 0 ? (
                <p className="text-neutral-400 text-sm">No expense data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

          {showForm && (
        <TransactionForm
          initialData={editing}
          onSubmit={handleAddOrEdit}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
      {deleteId && (
        <ConfirmModal
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;