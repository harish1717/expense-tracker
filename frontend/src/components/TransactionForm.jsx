import { useState, useEffect } from 'react';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Other'];

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-blue-950 mb-4">
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'expense' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                form.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: 'income' })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                form.type === 'income' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Income
            </button>
          </div>

          <input
            name="amount" type="number" step="0.01" placeholder="Amount" value={form.amount}
            onChange={handleChange} required
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
          />

          <select
            name="category" value={form.category} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            name="date" type="date" value={form.date} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
          />

          <input
            name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-blue-950 text-white hover:bg-blue-900"
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