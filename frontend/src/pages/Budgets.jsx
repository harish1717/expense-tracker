import { useState, useEffect } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { CATEGORIES } from '../components/TransactionForm';

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const month = getCurrentMonth();

  const fetchBudgets = async () => {
    setLoading(true);
    const res = await api.get(`/budget/${month}`);
    setBudgets(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/budget', { month, category, limit: parseFloat(limit) });
    setLimit('');
    setShowForm(false);
    fetchBudgets();
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this budget?')) return;
    await api.delete(`/budget/${id}`);
    fetchBudgets();
  };

  const availableCategories = CATEGORIES.filter((c) => !budgets.some((b) => b.category === c));
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Budgets — {month}</h2>
            {availableCategories.length > 0 && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                {showForm ? 'Cancel' : '+ Add Budget'}
              </button>
            )}
          </div>

          {budgets.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
                <p className="text-sm text-neutral-500">Total Budgeted</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">₹{totalLimit.toFixed(2)}</p>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5 border-l-4 border-red-500">
                <p className="text-sm text-neutral-500">Total Spent</p>
                <p className="text-2xl font-bold text-red-500">₹{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          )}

          {showForm && (
            <form onSubmit={handleAdd} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4 mb-4 flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="number"
                placeholder="Limit amount"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
                className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg text-sm font-semibold">
                Save
              </button>
            </form>
          )}

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5">
            {loading ? (
              <p className="text-neutral-400 text-sm">Loading...</p>
            ) : budgets.length === 0 ? (
              <p className="text-neutral-400 text-sm">No category budgets set for this month yet.</p>
            ) : (
              <div className="space-y-5">
                {budgets.map((b) => {
                  const isOver = b.percentUsed >= 100;
                  const isNear = b.percentUsed >= 80 && b.percentUsed < 100;
                  const barColor = isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-amber-600';

                  return (
                    <div key={b._id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                          {b.category} {isOver && '⚠️'} {isNear && !isOver && '⚡'}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-neutral-400">
                            ₹{b.spent.toFixed(2)} / ₹{b.limit.toFixed(2)} ({b.percentUsed}%)
                          </span>
                          <button onClick={() => handleDelete(b._id)} className="text-xs text-red-500 hover:underline">
                            remove
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${barColor}`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgets;