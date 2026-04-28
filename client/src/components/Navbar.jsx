import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition',
    isActive
      ? 'bg-gradient-to-r from-rose-300 to-pink-300 text-rose-950 shadow-lg shadow-rose-500/30'
      : 'text-rose-100 hover:bg-white/15 hover:text-white'
  ].join(' ');

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#2a0d1acc] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/chat" className={navLinkClass}>
                Chat
              </NavLink>
              <div className="hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-rose-50 sm:block">
                {user?.username}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Signup
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
