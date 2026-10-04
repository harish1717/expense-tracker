import { useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [nameMsg, setNameMsg] = useState('');
  const [nameError, setNameError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  const handleNameSave = async (e) => {
    e.preventDefault();
    setNameError('');
    setNameMsg('');
    try {
      const res = await api.put('/auth/profile', { name });
      login({ ...user, name: res.data.name });
      setNameMsg('Name updated successfully.');
    } catch (err) {
      setNameError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassMsg('');
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setPassMsg('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors">
      <Sidebar />
      <div className="md:pl-64">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Profile & Settings</h2>

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-1">Your Name</h3>
            <p className="text-xs text-neutral-400 mb-4">Email: {user?.email}</p>
            {nameMsg && <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm px-3 py-2 rounded-lg mb-3">{nameMsg}</div>}
            {nameError && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-3">{nameError}</div>}
            <form onSubmit={handleNameSave} className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
                Save
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm p-5">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mb-4">Change Password</h3>
            {passMsg && <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm px-3 py-2 rounded-lg mb-3">{passMsg}</div>}
            {passError && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-3">{passError}</div>}
            <form onSubmit={handlePasswordSave} className="space-y-3">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-4 py-2 rounded-lg transition">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;