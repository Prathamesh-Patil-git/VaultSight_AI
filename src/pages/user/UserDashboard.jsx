import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { 
  Wallet, 
  Send, 
  History, 
  HelpCircle, 
  Eye, 
  AlertTriangle, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useApp();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('user/transactions');
        setTransactions(response.data.slice(0, 10)); // Top 10 for desktop
      } catch (error) {
        console.error('Error fetching dashboard txns:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  if (!user || loading) return (
     <div className="h-full flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-navy-900 border-t-transparent rounded-full animate-spin"></div>
     </div>
  );

  const isLocked = user.isLocked;

  return (
    <div className="space-y-10 pb-10">
      {/* Top Welcome / Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-4xl font-black text-navy-900 italic tracking-tighter uppercase">Operations Hub</h2>
           <p className="text-slate-500 font-medium">Monitoring secure synchronization for <span className="text-navy-900 font-black italic">@{user.username}</span></p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-[1.5rem] border border-slate-200 shadow-sm">
           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isLocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-danger animate-pulse' : 'bg-success'}`}></div>
              {isLocked ? 'Neural Lock Active' : 'Protocol Stable'}
           </div>
           <div className="w-px h-8 bg-slate-100"></div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pr-4">Node: {user.accountNumber?.slice(-4)}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT COLUMN: Main Financials */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
           
           {/* Main Stats Row */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Balance Card */}
              <div className="md:col-span-2 bg-navy-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-navy-900/40 relative overflow-hidden group border border-white/5">
                <div className="absolute -top-12 -right-12 w-80 h-80 bg-electric/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="relative z-10 space-y-12">
                   <div className="flex items-center justify-between">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <ShieldCheck size={28} className="text-electric" />
                      </div>
                      <Link to="/user/card" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card View</span>
                        <ArrowUpRight size={14} className="text-electric" />
                      </Link>
                   </div>
                   
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Total Vault Capacity</p>
                      <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-electric italic">₹</span>
                        <h3 className="text-6xl md:text-7xl font-black tracking-tighter italic">{user.balance?.toLocaleString()}</h3>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-4">
                      <Link to="/user/send" className="px-10 py-5 bg-white text-navy-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-electric hover:text-white transition-all active:scale-95">Initiate Transfer</Link>
                      <button className="px-10 py-5 bg-navy-800/60 backdrop-blur-xl rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-white/5 hover:bg-navy-800 transition-all active:scale-95">Vault Settings</button>
                   </div>
                </div>
              </div>

              {/* Secondary Quick Access */}
              <div className="bg-white rounded-[3rem] border border-slate-200 p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                 <div className="space-y-6">
                    <div className="bg-success/10 text-success p-4 rounded-2xl w-fit border border-success/10">
                       <Zap size={24} />
                    </div>
                    <div>
                       <h4 className="text-xl font-black text-navy-900 italic tracking-tighter uppercase">Quick UPI</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified: {user.upiId}</p>
                    </div>
                 </div>
                 <div className="pt-8 space-y-3">
                    <Link to="/user/send" className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between px-6 hover:bg-slate-100 transition-all">
                       <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">Transfer by UPI</span>
                       <ArrowRight size={16} className="text-electric" />
                    </Link>
                    <button className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between px-6 hover:bg-slate-100 transition-all">
                       <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">Scan Metadata</span>
                       <ArrowRight size={16} className="text-slate-400" />
                    </button>
                 </div>
              </div>
           </div>

           {/* Full Width Transactions Feed */}
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <h4 className="text-sm font-black text-navy-900 uppercase tracking-[0.2em] italic border-l-4 border-electric pl-4">Neural Log Stream</h4>
                 <Link to="/user/history" className="text-[10px] font-black text-electric uppercase tracking-widest hover:underline underline-offset-8 transition-all">See All Records</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {transactions.length > 0 ? transactions.map((txn) => (
                  <div key={txn._id} className="p-8 hover:bg-slate-50/80 transition-all group flex items-center justify-between">
                     <div className="flex items-center gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${txn.type === 'send' ? 'bg-danger/5 text-danger' : 'bg-success/5 text-success'} border border-current/10 shadow-sm`}>
                           {txn.type === 'send' ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
                        </div>
                        <div className="space-y-1">
                           <h5 className="font-black text-navy-900 text-base tracking-tight italic">{txn.receiverUpiId || 'Internal Transfer Sync'}</h5>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                              <span>{txn.transactionId}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-xl font-black italic tracking-tighter ${txn.type === 'send' ? 'text-navy-900' : 'text-success'}`}>
                           {txn.type === 'send' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                        </p>
                        <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           txn.status === 'COMPLETED' ? 'bg-success/10 text-success' : 
                           txn.status === 'FLAGGED' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
                        }`}>
                           <div className={`w-1 h-1 rounded-full ${txn.status === 'COMPLETED' ? 'bg-success' : 'bg-warning animate-ping'}`}></div>
                           {txn.status}
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="py-24 text-center text-slate-400 italic font-bold uppercase tracking-widest">No vault activity detected in this cycle.</div>
                )}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN: Sidebar info */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
           
           {/* Security Insight Card */}
           <div className={`rounded-[3rem] p-10 border shadow-2xl backdrop-blur-3xl relative overflow-hidden group ${isLocked ? 'bg-danger/5 border-danger/20 text-danger' : 'bg-navy-900 text-white border-white/5'}`}>
              {!isLocked && <div className="absolute top-0 right-0 p-8 text-electric/5 scale-150 group-hover:scale-[1.7] transition-all duration-1000"><ShieldCheck size={120} /></div>}
              
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <Activity size={20} className={isLocked ? 'text-danger' : 'text-electric animate-pulse'} />
                    <h5 className="text-xs font-black uppercase tracking-[0.3em]">Threat Diagnosis</h5>
                 </div>
                 
                 {isLocked ? (
                   <div className="space-y-4">
                      <p className="text-sm font-bold leading-relaxed italic border-l-2 border-danger pl-4">Account status: SYSTEM_LOCK. Vector search detected anomalous transaction patterns matching known threat signatures.</p>
                      <button className="w-full py-4 bg-danger text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-danger/20 transition-all hover:scale-95">Initiate Dispute</button>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <p className="text-sm font-medium text-slate-400 italic">Neural shields are processing real-time telemetry. Current risk score is within baseline limits.</p>
                      <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                         <div className="flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Perimeter Stability</span>
                            <span>98.4%</span>
                         </div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-electric w-[98.4%]"></div>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Quick References */}
           <div className="space-y-6">
              <h5 className="text-xs font-black text-navy-900 uppercase tracking-[0.3em] italic px-4">Vault Intelligence</h5>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { label: 'Neural Protection', value: 'Active', color: 'text-success', icon: <ShieldCheck size={18}/> },
                   { label: 'Session Integrity', value: 'Verified', color: 'text-electric', icon: <Activity size={18}/> },
                   { label: 'Vector Sync', value: 'Complete', color: 'text-purple-400', icon: <History size={18}/> },
                 ].map((stat, i) => (
                   <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-slate-50 rounded-xl text-slate-400">{stat.icon}</div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      </div>
                      <p className={`text-xs font-black ${stat.color} uppercase`}>{stat.value}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* SOC Support Banner */}
           <div className="bg-gradient-to-br from-electric to-blue-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-electric/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-all"></div>
              <h5 className="text-xl font-black italic uppercase tracking-tighter mb-2">SOC Support</h5>
              <p className="text-[10px] font-bold text-white/70 mb-8 leading-relaxed">Direct encrypted line to our autonomous security operations center for critical disputes.</p>
              <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest">
                 Connect to Analyst <ArrowRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
