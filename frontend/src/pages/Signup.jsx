import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Signup() {
	const [formData, setFormData] = useState({ name: '', email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const res = await api.post('/auth/register', formData);
			login(res.data);
			navigate('/dashboard');
		} catch (err) {
			setError(err.response?.data?.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
			<div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
				<h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
				<p className="text-gray-500 text-sm mb-6">Start tracking your expenses smartly</p>

				{error && (
					<div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="name" placeholder="Full name" value={formData.name} onChange={handleChange} required
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
					/>
					<input
						name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
					/>
					<input
						name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required
						className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
					/>
					<button
						type="submit" disabled={loading}
						className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
					>
						{loading ? 'Creating account...' : 'Sign Up'}
					</button>
				</form>

				<p className="text-center text-sm text-gray-500 mt-6">
					Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Login</Link>
				</p>
			</div>
		</div>
	);
}

export default Signup;