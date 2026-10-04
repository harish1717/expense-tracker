import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

function Sidebar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/transactions', label: 'All Transactions', icon: '📋' },
    { to: '/budgets', label: 'Budgets', icon: '🎯' },
    { to: '/reports', label: 'Reports', icon: '📈' },
    { to: '/categories', label: 'Categories', icon: '🏷️' },
    { to: '/profile', label: 'Profile & Settings', icon: '⚙️' },
  ];

  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-black border-r border-neutral-800 z-30">
        <div className="px-6 py-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold text-white">💰 ExpenseTracker</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-amber-500 text-black'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-neutral-800 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white transition"
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <div className="px-3 pt-1 text-xs text-neutral-500">Signed in as</div>
          <div className="px-3 pb-2 text-sm text-white font-medium truncate">{user?.name}</div>
          <button
            onClick={handleLogout}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold px-3 py-2.5 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden sticky top-0 z-40 bg-black border-b border-neutral-800 px-4 py-3 flex items-center justify-between overflow-x-auto">
        <h1 className="text-base font-bold text-white shrink-0">💰 ExpenseTracker</h1>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={toggleDarkMode} className="text-lg px-1">{darkMode ? '☀️' : '🌙'}</button>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-xs font-medium px-2 py-1.5 rounded whitespace-nowrap ${
                location.pathname === item.to ? 'bg-amber-500 text-black' : 'text-neutral-300'
              }`}
            >
              {item.icon}
            </Link>
          ))}
          <button onClick={handleLogout} className="text-xs font-semibold bg-amber-500 text-black px-2 py-1.5 rounded">
            Logout
          </button>
        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal
  title="Logout"
  message="Are you sure you want to logout?"
  confirmLabel="Yes, Logout"
  onConfirm={confirmLogout}
  onCancel={() => setShowLogoutConfirm(false)}
/>
      )}
    </>
  );
}

export default Sidebar;