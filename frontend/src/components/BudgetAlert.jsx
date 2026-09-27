import { useState, useEffect } from 'react';
import api from '../api/axios';
import { CATEGORIES } from './TransactionForm';

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function BudgetAlert() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const month = getCurrentMonth();

  const fetchBudgets = async () => {
    const res = await api.get(`/budget/${month}`);
    setBudgets(res.data);
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
    await api.delete(`/budget/${id}`);
    fetchBudgets();
  };

  const availableCategories = CATEGORIES.filter(
    (c) => !budgets.some((b) => b.category === c)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">Category Budgets ({month})</p>
        {availableCategories.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-medium text-blue-950 hover:underline"
          >
            {showForm ? 'Cancel' : '+ Add budget'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="Limit amount"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            required
            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <button type="submit" className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Save
          </button>
        </form>
      )}

      {budgets.length === 0 ? (
        <p className="text-sm text-gray-400">No category budgets set yet — add one to get spending alerts.</p>
      ) : (
        <div className="space-y-3">
          {budgets.map((b) => {
            const isOver = b.percentUsed >= 100;
            const isNear = b.percentUsed >= 80 && b.percentUsed < 100;
            const barColor = isOver ? 'bg-red-500' : isNear ? 'bg-amber-500' : 'bg-blue-950';

            return (
              <div key={b._id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {b.category} {isOver && '⚠️'} {isNear && !isOver && '⚡'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      ₹{b.spent.toFixed(2)} / ₹{b.limit.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      remove
                    </button>
                  </div>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(b.percentUsed, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BudgetAlert;