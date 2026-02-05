import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Users, FileText, CreditCard, LogIn, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
  const { user, loading } = useApp();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/user/login" replace />;
  }

  const navItems = [
    { icon: <Users size={20} />, label: "Users", path: "users" },
    { icon: <FileText size={20} />, label: "Transactions", path: "transactions" },
    { icon: <CreditCard size={20} />, label: "UPI Logs", path: "upi" },
    { icon: <LogIn size={20} />, label: "Login Activity", path: "logins" },
    { icon: <ShieldCheck size={20} />, label: "Security Control", path: "security" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col border-r border-navy-700">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Core Management</h2>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-electric/10 text-electric border-r-4 border-electric' : 'hover:bg-navy-800 hover:text-white'}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 bg-navy-800/40 border-t border-navy-700">
          <div className="bg-navy-900 rounded-xl p-4 border border-navy-700">
            <p className="text-xs text-slate-400 mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-white">Live Feed Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
