import BudgetAlert from '../components/BudgetAlert';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TransactionForm from '../components/TransactionForm';

const COLORS = ['#e365e8', '#2563eb', '#771a1f', '#93c5fd', '#8aa634', '#3b82f6', '#0ea5e9', '#0284c7'];

function Dashboard() {
	const [transactions, setTransactions] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(null);
	const [loading, setLoading] = useState(true);

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

	const handleDelete = async (id) => {
		if (!confirm('Delete this transaction?')) return;
		await api.delete(`/transactions/${id}`);
		fetchTransactions();
	};

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
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
				<BudgetAlert />
				{/* Summary cards */}
		
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
						<div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-blue-950">
							<p className="text-sm text-gray-500">Balance</p>
							<p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-950' : 'text-red-600'}`}>₹{balance.toFixed(2)}</p>
						</div>
						<div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-green-500">
							<p className="text-sm text-gray-500">Income</p>
							<p className="text-2xl font-bold text-green-600">₹{income.toFixed(2)}</p>
						</div>
						<div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-red-500">
							<p className="text-sm text-gray-500">Expenses</p>
							<p className="text-2xl font-bold text-red-600">₹{expense.toFixed(2)}</p>
						</div>
					</div>

					{/* Add button */}
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-bold text-gray-800">Transactions</h2>
						<button
							onClick={() => { setEditing(null); setShowForm(true); }}
							className="bg-blue-950 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
						>
							+ Add Transaction
						</button>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Transaction list */}
						<div className="lg:col-span-2 bg-white rounded-xl shadow-sm divide-y divide-gray-100">
							{loading ? (
								<p className="p-6 text-gray-400 text-sm">Loading...</p>
							) : transactions.length === 0 ? (
								<p className="p-6 text-gray-400 text-sm">No transactions yet. Add your first one!</p>
							) : (
								transactions.map((t) => (
									<div key={t._id} className="flex justify-between items-center p-4 hover:bg-gray-50">
										<div>
											<p className="font-medium text-gray-800">{t.category}</p>
											<p className="text-xs text-gray-400">{new Date(t.date).toLocaleDateString()} {t.note && `· ${t.note}`}</p>
										</div>
										<div className="flex items-center gap-3">
											<span className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
												{t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
											</span>
											<button
												onClick={() => { setEditing(t); setShowForm(true); }}
												className="text-xs text-blue-800 hover:underline"
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

						{/* Chart */}
						<div className="bg-white rounded-xl shadow-sm p-5">
							<p className="text-sm font-medium text-gray-700 mb-2">Spending by Category</p>
							{categoryData.length === 0 ? (
								<p className="text-gray-400 text-sm">No expense data yet</p>
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

				{showForm && (
					<TransactionForm
						initialData={editing}
						onSubmit={handleAddOrEdit}
						onClose={() => { setShowForm(false); setEditing(null); }}
					/>
				)}
			</div>
			);
}

			export default Dashboard;