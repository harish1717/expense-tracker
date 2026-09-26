import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';
import Navbar from '../components/Navbar';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-sm text-blue-950 hover:underline">← Back</Link>
          <h2 className="text-lg font-bold text-gray-800">Monthly Reports</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-400 text-sm">Not enough data yet — add transactions across a few months to see trends.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#16a34a" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#dc2626" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Monthly breakdown table */}
        {data.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mt-6 divide-y divide-gray-100">
            {data.slice().reverse().map((d) => (
              <div key={d.month} className="flex justify-between items-center p-4">
                <span className="font-medium text-gray-700">{d.month}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">+₹{d.income.toFixed(2)}</span>
                  <span className="text-red-600">-₹{d.expense.toFixed(2)}</span>
                  <span className={`font-semibold ${d.income - d.expense >= 0 ? 'text-blue-950' : 'text-red-600'}`}>
                    ₹{(d.income - d.expense).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;