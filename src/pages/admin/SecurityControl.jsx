import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Users, CreditCard, Activity, Search, AlertTriangle, Eye, Unlock, ShieldCheck, Clock } from 'lucide-react';
import UserDetailModal from '../../components/UserDetailModal';

const SecurityControl = () => {
  const { users, fetchUsers } = useApp();
  const [stats, setStats] = useState({
    lockedUsers: 0,
    activeThreats: 0,
    flaggedToday: 0,
    alertsActive: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats({
          lockedUsers: response.data.lockedUsers,
          activeThreats: response.data.flaggedTransactions, // Using flagged txns as proxy for now
          flaggedToday: response.data.flaggedTransactions,
          alertsActive: response.data.recentAlerts?.length || 0
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    fetchUsers();
    fetchStats();
  }, []);

  const lockedUsersList = users.filter(u => u.isLocked);

  const handleUnlock = async (userId) => {
    try {
      await api.post(`/admin/unlock/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Unlock failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Security Control Panel</h1>
          <p className="text-slate-500 text-sm">Autonomous response and manual override dashboard.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-xl border border-success/20">
           <ShieldCheck size={18} />
           <span className="text-xs font-bold uppercase tracking-wider">AI Guard Protocol: Active</span>
        </div>
      </div>

       {/* Top Stats Cards */}
       <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Locked Accounts', value: stats.lockedUsers, icon: <Users size={20}/>, color: 'text-danger', bg: 'bg-red-50' },
          { label: 'Active Threats', value: stats.activeThreats, icon: <ShieldAlert size={20}/>, color: 'text-warning', bg: 'bg-amber-50' },
          { label: 'Flagged Today', value: stats.flaggedToday, icon: <CreditCard size={20}/>, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Alerts Active', value: stats.alertsActive, icon: <Activity size={20}/>, color: 'text-electric', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bg} ${stat.color.replace('text', 'text')} rounded-xl flex items-center justify-center`}>
               {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Table section */}
        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                   <AlertTriangle className="text-danger" size={18} />
                   Locked Accounts Queue
                </h2>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                   Requires Manual Review
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left">User Name</th>
                        <th className="px-6 py-4 text-left">Account Number</th>
                        <th className="px-6 py-4 text-left">Lock Reason</th>
                        <th className="px-6 py-4 text-left">Locked At</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {lockedUsersList.length > 0 ? lockedUsersList.map(user => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-bold text-slate-900">{user.name}</td>
                           <td className="px-6 py-4 font-mono text-sm text-slate-500">{user.accountNumber}</td>
                           <td className="px-6 py-4">
                              <span className="text-xs px-2 py-1 bg-danger/5 text-danger border border-danger/10 rounded font-medium">
                                 {user.lockReason || 'Unusual Activity Pattern'}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                             {user.lockedAt ? new Date(user.lockedAt).toLocaleTimeString() : 'Recently'}
                           </td>
                           <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleUnlock(user._id)}
                                  className="px-3 py-1.5 bg-success text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-success/20"
                                >
                                   <Unlock size={14} /> Unlock
                                </button>
                                 <button 
                                   onClick={() => {
                                     setSelectedUser(user);
                                     setIsViewModalOpen(true);
                                   }}
                                   className="p-1.5 text-slate-400 hover:text-electric hover:bg-slate-100 rounded-lg"
                                 >
                                    <Eye size={16} />
                                 </button>
                             </div>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2 opacity-20">
                                 <ShieldCheck size={48} />
                                 <p className="font-bold uppercase tracking-widest text-sm text-slate-900">No Pending Locks</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>

          <div className="bg-navy-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                <Activity size={120} />
             </div>
             <div className="relative z-10 space-y-4 max-w-lg">
                <h3 className="text-xl font-bold">Auto-Lock Protocol Insight</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                   VaultSight AI automatically triggers protective freezes when risk scores exceed <span className="text-white font-bold">75</span> or high-value transactions ( &gt; ₹1,00,000 ) occur from unverified device clusters.
                </p>
                <div className="flex gap-4">
                   <div className="bg-navy-800 p-4 rounded-2xl border border-navy-700 flex-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Confidence Thresh</p>
                      <p className="text-lg font-black text-electric">92.4%</p>
                   </div>
                   <div className="bg-navy-800 p-4 rounded-2xl border border-navy-700 flex-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Response Time</p>
                      <p className="text-lg font-black text-success">14ms</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Alerts Feed Sidebar */}
        <div className="col-span-4 space-y-6">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h2 className="font-bold text-slate-900 uppercase tracking-tighter text-sm flex gap-2 items-center">
                    <Clock size={16} className="text-electric" />
                    Security Alert Feed
                 </h2>
              </div>
              <div className="p-4 space-y-4">
                 {[
                   { type: 'CRITICAL', title: 'Unauthorized API Access Attempt', time: '2m ago', color: 'text-danger', bg: 'bg-danger' },
                   { type: 'WARNING', title: 'Multiple failed logins detected', time: '15m ago', color: 'text-warning', bg: 'bg-warning' },
                   { type: 'INFO', title: 'System wide backup complete', time: '1h ago', color: 'text-electric', bg: 'bg-electric' },
                   { type: 'CRITICAL', title: 'Velocity limit hit for User ID: 442', time: '2h ago', color: 'text-danger', bg: 'bg-danger' },
                   { type: 'WARNING', title: 'New device added to Trusted List', time: '3h ago', color: 'text-warning', bg: 'bg-warning' },
                 ].map((alert, i) => (
                   <div key={i} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                      <div className={`w-1.5 rounded-full ${alert.bg}`}></div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-[9px] font-black tracking-widest uppercase ${alert.color}`}>{alert.type}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{alert.time}</span>
                         </div>
                         <h4 className="text-sm font-bold text-slate-800 leading-tight">{alert.title}</h4>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="m-4 mt-auto py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 text-xs font-bold transition-all">
                View All Security Events
              </button>
           </div>
        </div>
       </div>

      <UserDetailModal 
        user={selectedUser} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        onUnlock={handleUnlock}
      />
    </div>
  );
};

export default SecurityControl;
