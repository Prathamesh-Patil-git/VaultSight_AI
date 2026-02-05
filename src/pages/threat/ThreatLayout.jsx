import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Activity, ShieldAlert, UserX, Search, BarChart3, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ThreatLayout = () => {
  const { user, loading } = useApp();

  if (loading) return null;
  if (!user || (user.role !== 'soc' && user.role !== 'admin')) {
    return <Navigate to="/user/login" replace />;
  }

  const navItems = [
    { icon: <Activity size={20} />, label: "Overview", path: "." },
    { icon: <ShieldAlert size={20} />, label: "Fraud Logs", path: "fraud" },
    { icon: <UserX size={20} />, label: "Login Anomalies", path: "anomalies" },
    { icon: <Search size={20} />, label: "Semantic Search", path: "search" },
    { icon: <BarChart3 size={20} />, label: "Risk Analysis", path: "risk" },
    { icon: <Clock size={20} />, label: "Auto-Locks", path: "locks" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-navy-900 text-slate-100">
      {/* Sidebar - Dark theme */}
      <aside className="w-64 bg-navy-900 flex flex-col border-r border-navy-800 shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8 bg-danger/10 p-3 rounded-xl border border-danger/20">
            <div className="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-danger uppercase tracking-tighter">Threat Engine Active</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "."}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-electric text-white shadow-lg shadow-electric/30' : 'text-slate-400 hover:bg-navy-800 hover:text-white'}`}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-navy-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase font-bold">API Status</span>
              <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">STABLE</span>
            </div>
            <div className="bg-navy-800 h-2 rounded-full overflow-hidden">
              <div className="bg-electric h-full w-[85%]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-navy-900 via-navy-900 to-navy-800">
        <Outlet />
      </main>
    </div>
  );
};

export default ThreatLayout;
