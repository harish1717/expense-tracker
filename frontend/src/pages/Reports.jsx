import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/transactions/reports/summary').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/dashboard" className="text-sm text-amber-600 dark:text-amber-400 hover:underline">← Back</Link>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Monthly Reports</h2>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5">
            {loading ? (
              <p className="text-neutral-400 text-sm">Loading...</p>
            ) : data.length === 0 ? (
              <p className="text-neutral-400 text-sm">Not enough data yet — add transactions across a few months to see trends.</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#f59e0b" name="Expense" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {data.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm mt-6 divide-y divide-neutral-100 dark:divide-neutral-800">
              {data.slice().reverse().map((d) => (
                <div key={d.month} className="flex justify-between items-center p-4">
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">{d.month}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-500">+₹{d.income.toFixed(2)}</span>
                    <span className="text-red-500">-₹{d.expense.toFixed(2)}</span>
                    <span className={`font-semibold ${d.income - d.expense >= 0 ? 'text-neutral-900 dark:text-white' : 'text-red-500'}`}>
                      ₹{(d.income - d.expense).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;