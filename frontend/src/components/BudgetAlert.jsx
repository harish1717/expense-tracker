import { useState, useEffect } from 'react';
import api from '../api/axios';

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function BudgetAlert() {
  const [status, setStatus] = useState(null);
  const [editing, setEditing] = useState(false);
  const [limitInput, setLimitInput] = useState('');
  const month = getCurrentMonth();

  const fetchStatus = async () => {
    const res = await api.get(`/budget/${month}`);
    setStatus(res.data);
    setLimitInput(res.data.limit || '');
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    await api.post('/budget', { month, limit: parseFloat(limitInput) });
    setEditing(false);
    fetchStatus();
  };

  if (!status) return null;

  // No budget set yet
  if (!status.limit) {
    return editing ? (
      <form onSubmit={handleSetBudget} className="bg-white rounded-xl shadow-sm p-4 mb-6 flex gap-2">
        <input
          type="number" placeholder="Set monthly budget limit" value={limitInput}
          onChange={(e) => setLimitInput(e.target.value)} required
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-800 text-sm"
        />
        <button type="submit" className="bg-blue-950 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
      </form>
    ) : (
      <button
        onClick={() => setEditing(true)}
        className="w-full bg-white rounded-xl shadow-sm p-4 mb-6 text-sm text-blue-950 font-medium text-left hover:bg-blue-50 transition"
      >
        + Set a monthly budget to get spending alerts
      </button>
    );
  }

  const pct = status.percentUsed;
  const isOver = pct >= 100;
  const isNear = pct >= 80 && pct < 100;

  const barColor = isOver ? 'bg-red-500' : isNear ? 'bg-amber-500' : 'bg-blue-950';
  const bannerColor = isOver ? 'bg-red-50 text-red-700' : isNear ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-900';

  return (
    <div className={`rounded-xl shadow-sm p-4 mb-6 ${bannerColor}`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">
          {isOver ? '⚠️ Over budget!' : isNear ? '⚡ Close to your budget limit' : '✅ On track this month'}
        </p>
        <button onClick={() => setEditing(true)} className="text-xs underline opacity-70">edit</button>
      </div>
      <div className="w-full bg-white/60 rounded-full h-2 mb-1">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <p className="text-xs opacity-80">₹{status.spent.toFixed(2)} of ₹{status.limit.toFixed(2)} spent ({pct}%)</p>

      {editing && (
        <form onSubmit={handleSetBudget} className="flex gap-2 mt-3">
          <input
            type="number" value={limitInput} onChange={(e) => setLimitInput(e.target.value)} required
            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <button type="submit" className="bg-blue-950 text-white px-3 py-1.5 rounded-lg text-xs font-medium">Save</button>
        </form>
      )}
    </div>
  );
}

export default BudgetAlert;