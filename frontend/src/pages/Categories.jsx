import { useState, useEffect } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await api.get('/auth/categories');
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newCategory.trim()) return;
    try {
      const res = await api.post('/auth/categories', { name: newCategory.trim() });
      setCategories(res.data);
      setNewCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (name) => {
    if (!confirm(`Delete category "${name}"? Existing transactions in this category will keep the label, but you won't be able to pick it for new ones.`)) return;
    const res = await api.delete(`/auth/categories/${encodeURIComponent(name)}`);
    setCategories(res.data);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Categories</h2>

          <form onSubmit={handleAdd} className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-4 mb-4 flex gap-2">
            <input
              type="text"
              placeholder="New category name (e.g. Travel, Gifts)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
              + Add
            </button>
          </form>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
          )}

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm divide-y divide-neutral-100 dark:divide-neutral-800">
            {loading ? (
              <p className="p-6 text-neutral-400 text-sm">Loading...</p>
            ) : categories.length === 0 ? (
              <p className="p-6 text-neutral-400 text-sm">No categories yet.</p>
            ) : (
              categories.map((c) => (
                <div key={c} className="flex justify-between items-center p-4">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{c}</span>
                  <button
                    onClick={() => handleDelete(c)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;