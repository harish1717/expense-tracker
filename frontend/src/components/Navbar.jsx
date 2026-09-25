import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-950 px-4 sm:px-6 py-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">💰 ExpenseTracker</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-200 hidden sm:block">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;