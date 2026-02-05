import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import api from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ShieldAlert, AlertCircle, Lock, TrendingUp, Search, Eye, ArrowRight, Zap, Activity, ShieldX } from 'lucide-react';

const ThreatOverview = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    flaggedTransactions: 0,
    lockedUsers: 0,
    totalTransactionVolume: 0,
    recentAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const riskData = [
    { name: 'Low', value: stats.totalTransactions - stats.flaggedTransactions, color: '#10B981' },
    { name: 'High', value: stats.flaggedTransactions, color: '#EF4444' }
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">SOC Command Matrix</h1>
          <p className="text-slate-500 font-medium">Global threat intelligence and autonomous response matrix.</p>
        </div>
        <div className="flex bg-navy-800 p-1 rounded-xl border border-navy-700">
           <div className="flex items-center gap-2 px-4 py-2 bg-electric/10 text-electric rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-electric/5">
              <div className="w-2 h-2 bg-electric rounded-full animate-ping"></div>
              Real-time Feed Active
           </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-6">
        {[
          { label: 'Network Load', value: stats.totalTransactions, color: 'text-electric', icon: <Activity size={16}/> },
          { label: 'Threat Signals', value: stats.flaggedTransactions, color: 'text-warning', icon: <ShieldAlert size={16}/> },
          { label: 'Locked Nodes', value: stats.lockedUsers, color: 'text-danger', icon: <Lock size={16}/> },
          { label: 'Volume (₹)', value: stats.totalTransactionVolume?.toLocaleString(), color: 'text-success', icon: <Zap size={16}/> },
          { label: 'Active Alerts', value: stats.recentAlerts?.length, color: 'text-purple-400', icon: <AlertCircle size={16}/> },
        ].map((stat, i) => (
          <div key={i} className="bg-navy-800/50 p-6 rounded-[2rem] border border-navy-700 shadow-xl backdrop-blur-md hover:border-electric/30 transition-all duration-500 group">
             <div className="flex items-center gap-2 mb-3 text-slate-500 group-hover:text-white transition-colors">
                {stat.icon}
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
             </div>
             <p className={`text-2xl font-black tracking-tighter italic ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Charts */}
        <div className="col-span-8 space-y-8">
          <div className="bg-navy-800/50 p-10 rounded-[3rem] border border-navy-700 shadow-2xl h-[450px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <TrendingUp size={120} />
             </div>
             <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-10">Neural Traffic Analysis</h3>
             <ResponsiveContainer width="100%" height="80%" minWidth={0}>
                <AreaChart data={[{ day: 'Mon', threats: 10 }, { day: 'Tue', threats: 15 }, { day: 'Wed', threats: stats.flaggedTransactions }]}>
                   <defs>
                      <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                         <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                   <XAxis dataKey="day" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                   <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dx={-10} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                     itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                   />
                   <Area type="monotone" dataKey="threats" stroke="#3B82F6" strokeWidth={5} fillOpacity={1} fill="url(#colorThreat)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="bg-navy-800/50 p-10 rounded-[3rem] border border-navy-700 shadow-2xl h-[350px]">
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-6">Risk Attribution</h3>
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                   <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                      />
                   </PieChart>
                </ResponsiveContainer>
             </div>
             
             <div className="bg-navy-900 border-2 border-dashed border-navy-800 p-10 rounded-[3rem] flex flex-col justify-center gap-8 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-10 text-electric/5 group-hover:scale-110 transition-transform duration-1000">
                   <ShieldAlert size={160} />
                </div>
                <div className="relative z-10 space-y-4">
                   <h3 className="text-2xl font-black italic tracking-tighter">Vector Simulation</h3>
                   <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      Neural stress testing is active. Autonomous response logic is being trained on multi-vector search trajectories.
                   </p>
                   <button className="flex items-center gap-4 group/btn">
                      <div className="bg-electric p-4 rounded-2xl shadow-xl shadow-electric/20 group-hover/btn:scale-110 transition-all duration-300">
                         <Zap size={24} className="text-white fill-current" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-electric group-hover/btn:tracking-[0.3em] transition-all">Engage Neural Pulse</span>
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Recent Alert Feed */}
        <div className="col-span-4 space-y-6">
           <div className="bg-navy-800/50 rounded-[3rem] border border-navy-700 overflow-hidden flex flex-col h-full shadow-2xl backdrop-blur-xl">
              <div className="p-8 border-b border-navy-700 bg-navy-800/80">
                 <h2 className="font-black text-white uppercase tracking-tighter flex gap-3 items-center text-lg italic">
                    <Activity size={20} className="text-danger animate-pulse" />
                    Security Pulse
                 </h2>
              </div>
              <div className="p-8 space-y-8 flex-1 overflow-y-auto max-h-[700px] no-scrollbar">
                 {stats.recentAlerts.length > 0 ? stats.recentAlerts.map((alert) => (
                   <div key={alert._id} className="relative pl-8 pb-8 border-l border-navy-700 last:border-0 last:pb-0 group">
                      <div className={`absolute -left-[6px] top-0 w-3 h-3 rounded-full border-2 border-navy-900 shadow-md ${
                        alert.severity === 'CRITICAL' ? 'bg-danger shadow-danger/20' : 
                        alert.severity === 'WARNING' ? 'bg-orange-500' : 'bg-success'
                      }`}></div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">{alert._id.slice(-8)}</span>
                           <span className="text-[10px] font-bold text-slate-500">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-200 leading-relaxed group-hover:text-electric transition-colors italic">{alert.message}</h4>
                        <div className="flex items-center gap-4">
                           <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${
                             alert.severity === 'CRITICAL' ? 'bg-danger/10 text-danger border-danger/20' : 
                             alert.severity === 'WARNING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                             'bg-success/10 text-success border-success/20'
                           }`}>
                             {alert.severity}
                           </span>
                           <button className="text-[10px] font-black text-electric uppercase tracking-widest flex items-center gap-1 hover:gap-3 transition-all">
                              Analysis <ArrowRight size={12} />
                           </button>
                        </div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                      <ShieldX size={48} className="text-slate-500" />
                      <p className="text-xs font-black uppercase tracking-widest">Atmosphere Clear</p>
                   </div>
                 )}
              </div>
              <div className="p-8 bg-navy-900/80 border-t border-navy-700">
                 <div className="flex flex-col gap-6">
                    <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocol Stack</h5>
                    <div className="flex flex-wrap gap-2">
                       {['Sentinel', 'Vector', 'Risk-AI', 'Auto-Lock'].map((step, i) => (
                         <div key={i} className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-white bg-navy-800 px-3 py-1.5 rounded-lg border border-navy-700 shadow-xl">{step}</span>
                            {i < 3 && <ArrowRight size={12} className="text-slate-600" />}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatOverview;
