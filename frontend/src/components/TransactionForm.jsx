import { useState, useEffect } from 'react';

export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'];

function TransactionForm({ onSubmit, onClose, initialData }) {
  const [form, setForm] = useState({
    type: 'expense',
    category: 'Food',
    amount: '',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        category: initialData.category,
        amount: initialData.amount,
        note: initialData.note || '',
        date: initialData.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'expense' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                form.type === 'expense' ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'income' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                form.type === 'income' ? 'bg-green-500 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Income
            </button>
          </div>

          <input
            name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount}
            onChange={handleChange} required
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />

          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            name="date" type="date" value={form.date} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />

          <input
            name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 text-black hover:bg-amber-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;