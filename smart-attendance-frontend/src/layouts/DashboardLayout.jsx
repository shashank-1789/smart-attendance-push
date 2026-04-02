import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 shadow-sm ${
          sidebarOpen ? 'w-[260px]' : 'w-[76px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-200">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="text-[17px] font-extrabold text-gray-900 tracking-tight">SmartAttend</h1>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5 tracking-wide uppercase">Management System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {sidebarOpen && <span className="text-[13px]">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse */}
        <div className="px-3 py-2 border-t border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all text-[13px]"
          >
            <ChevronLeft className={`w-[18px] h-[18px] transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3.5 py-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.fullName}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mt-1 text-[13px]"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-[17px] font-extrabold text-gray-900">SmartAttend</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-3 py-5 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-[13px] ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`
                  }
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 w-full text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-[13px]"
              >
                <LogOut className="w-[18px] h-[18px]" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Welcome back, <span className="text-indigo-600">{user?.fullName?.split(' ')[0]}</span> 👋
              </h2>
              <p className="text-xs text-gray-400 font-medium">Here's what's happening today</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-indigo-600 font-semibold">{user?.role}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8 bg-[#f1f5f9]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
