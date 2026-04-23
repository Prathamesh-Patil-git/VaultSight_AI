import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Activity,
  ArrowRight,
  Clock,
  AlertTriangle,
  History as HistoryIcon
} from 'lucide-react';
import ComplaintModal from '../../components/ComplaintModal';

const UserDashboard = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [selectedTxnId, setSelectedTxnId] = useState(null);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('user/transactions');
        setTransactions(response.data.slice(0, 8)); // Top 8 for clean view
      } catch (error) {
        console.error('Error fetching dashboard txns:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  if (!user || loading) return (
     <div className="h-full flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Neural Assets...</p>
     </div>
  );

  const isLocked = user.isLocked;
  const cardIssued = user.debitCard?.isIssued;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Complaint Modal */}
      <ComplaintModal 
        isOpen={isComplaintModalOpen} 
        onClose={() => setIsComplaintModalOpen(false)} 
        transactionId={selectedTxnId}
      />
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8 md:pb-10">
        <div>
           <h2 className="text-2xl md:text-5xl font-black text-navy-900 italic tracking-tighter uppercase leading-none truncate">Operations Hub</h2>
           <div className="flex items-center gap-3 mt-4">
              <span className="w-2 h-2 bg-electric animate-pulse"></span>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.4em]">Active Node Selection: {user.accountNumber?.slice(-4)}</p>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-white p-2 md:p-3 rounded-lg border border-slate-200 shadow-sm w-full md:w-auto mt-4 md:mt-0">
           <button 
             onClick={() => {
                setSelectedTxnId(null);
                setIsComplaintModalOpen(true);
             }}
             className="flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 bg-slate-100 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 hover:bg-navy-900 hover:text-white transition-all whitespace-nowrap"
           >
              <AlertTriangle size={12} className="shrink-0" />
              Raise Dispute
           </button>
           <div className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap ${isLocked ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              <Activity size={12} className={isLocked ? 'animate-pulse shrink-0' : 'shrink-0'} />
              {isLocked ? 'Locked' : 'Stable'}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* MAIN OPERATIONS: LEFT */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
           
           {/* Visual Balance Card */}
           <div className="bg-navy-900 rounded-lg p-6 md:p-12 text-white shadow-2xl shadow-navy-900/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 md:p-12 text-electric/5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                 <ShieldCheck size={200} className="md:w-[280px] md:h-[280px]" />
              </div>
              <div className="absolute -bottom-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-electric/10 rounded-full blur-[80px] md:blur-[100px]"></div>
              
              <div className="relative z-10 space-y-10 md:space-y-16">
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.4em] italic mb-1 truncate">Available Credit Matrix</p>
                       <div className="flex items-baseline gap-2 md:gap-4 overflow-hidden">
                          <span className="text-xl md:text-3xl font-black text-electric italic shrink-0">₹</span>
                          <h3 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter italic leading-none truncate">{user.balance?.toLocaleString()}</h3>
                       </div>
                    </div>
                    {cardIssued ? (
                       <Link to="/user/card" className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group/btn">
                          <Zap size={24} className="text-electric group-hover/btn:scale-110 transition-transform" />
                       </Link>
                    ) : (
                       <div className="px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20 flex flex-col items-end">
                          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">Card Access</span>
                          <span className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest mt-1">Pending Sync</span>
                       </div>
                    )}
                 </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-5">
                    <Link to="/user/send" className="flex-1 px-6 md:px-10 py-4 md:py-5 bg-white text-navy-900 rounded-lg font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-2xl hover:bg-electric hover:text-white transition-all active:scale-95 group/x text-center whitespace-nowrap">
                       <span className="flex items-center justify-center gap-2 md:gap-3">
                          Execute Dispatch <ArrowRight size={14} className="md:w-4 md:h-4 group-hover/x:translate-x-1 transition-transform" />
                       </span>
                    </Link>
                    <button 
                      onClick={() => navigate('/user/change-pin')}
                      className="flex-1 px-6 md:px-10 py-4 md:py-5 bg-navy-800/60 backdrop-blur-xl rounded-lg font-black text-[9px] md:text-[11px] uppercase tracking-widest border border-white/5 hover:bg-electric hover:text-white transition-all active:scale-95 text-center whitespace-nowrap"
                    >
                       Security Matrix
                    </button>
                  </div>
              </div>
           </div>

           {/* Ledger Stream */}
           <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
              <div className="p-6 md:p-10 border-b border-slate-100 flex items-center justify-between">
                 <h4 className="text-[10px] md:text-xs font-black text-navy-900 uppercase tracking-[0.2em] md:tracking-[0.3em] italic border-l-4 border-electric pl-4 md:pl-6">Neural Ledger Stream</h4>
                 <Link to="/user/history" className="text-[9px] md:text-[10px] font-black text-electric uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    Access Archives <ArrowUpRight size={14} />
                 </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {transactions.length > 0 ? transactions.map((txn) => (
                  <div key={txn._id} className="p-6 md:p-10 hover:bg-slate-50/50 transition-all group flex items-center justify-between gap-4">
                     <div className="flex items-center gap-4 md:gap-10 min-w-0">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${txn.type === 'send' ? 'bg-danger/5 text-danger' : 'bg-success/5 text-success'} border border-current/10 shadow-sm shrink-0`}>
                           {txn.type === 'send' ? <TrendingDown size={20} className="md:w-7 md:h-7" /> : <TrendingUp size={20} className="md:w-7 md:h-7" />}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                           <h5 className="font-black text-navy-900 text-sm md:text-lg tracking-tight italic uppercase truncate">{txn.receiverUpiId || 'Internal Arc Sync'}</h5>
                           <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2 shrink-0"><Clock size={10} /> {new Date(txn.createdAt).toLocaleDateString()}</span>
                              <div className="hidden sm:block w-1 h-1 bg-slate-200 rounded-full"></div>
                              <span className="font-mono">{txn.transactionId?.slice(-8)}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-1.5 md:space-y-2 shrink-0">
                        <p className={`text-base md:text-2xl font-black italic tracking-tighter leading-none ${txn.type === 'send' ? 'text-navy-900' : 'text-success'}`}>
                           {txn.type === 'send' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                        </p>
                          <div className="flex items-center justify-end gap-2 md:gap-3">
                             <button 
                                 onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedTxnId(txn._id);
                                     setIsComplaintModalOpen(true);
                                 }}
                                 className="p-1.5 md:p-2 text-slate-300 hover:text-danger hover:bg-danger/5 rounded-lg transition-all"
                                 title="Dispute Vector"
                             >
                                 <AlertTriangle size={12} className="md:w-[14px] md:h-[14px]" />
                             </button>
                             <div className={`inline-flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${
                                 txn.status === 'COMPLETED' ? 'bg-success/5 text-success border border-success/10' : 
                                 txn.status === 'FLAGGED' ? 'bg-warning/5 text-warning border border-warning/10' : 'bg-danger/5 text-danger border border-danger/10'
                             }`}>
                                 <div className={`w-1 h-1 rounded-full ${txn.status === 'COMPLETED' ? 'bg-success' : 'bg-warning animate-ping'}`}></div>
                                 {txn.status}
                             </div>
                          </div>
                      </div>
                  </div>
                )) : (
                  <div className="py-24 flex flex-col items-center justify-center text-slate-400 italic font-bold uppercase tracking-widest space-y-4">
                     <ShieldAlert size={48} className="opacity-10" />
                     <span>No vault activity detected within current cycle.</span>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* SIDEBAR: RIGHT */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
           
           {/* Cyber Insight */}
            <div className={`rounded-lg p-6 md:p-10 border shadow-2xl relative overflow-hidden group transition-all duration-500 ${isLocked ? 'bg-danger/5 border-danger/20 text-danger scale-95 md:scale-100' : 'bg-white text-navy-900 border-slate-200'}`}>
               <div className="relative z-10 space-y-8 md:space-y-10">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 md:p-4 rounded-lg ${isLocked ? 'bg-danger text-white' : 'bg-navy-900 text-electric'}`}>
                        <ShieldAlert size={20} className="md:w-6 md:h-6" />
                     </div>
                     <div className="space-y-1">
                        <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Threat Matrix</h5>
                        <p className="text-lg md:text-xl font-black italic uppercase leading-none">{isLocked ? 'Locked' : 'Secured'}</p>
                     </div>
                  </div>
                 
                 {isLocked ? (
                    <div className="space-y-6">
                       <p className="text-sm font-bold leading-relaxed italic border-l-2 border-danger pl-6 text-danger/80 text-justify">
                          Autonomous locking sequence initialized. Anomalous vector signatures detected in recent regional transfers.
                       </p>
                       <button className="w-full py-5 bg-danger text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-xl shadow-danger/30 hover:shadow-danger/50 transition-all">
                          Initiate Manual Dispute
                       </button>
                    </div>
                 ) : (
                    <div className="space-y-10">
                       <div className="space-y-5">
                          <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span>Node Integrity</span>
                             <span>99.2%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                             <div className="h-full bg-navy-900 rounded-full w-[99.2%] transition-all duration-[2000ms]"></div>
                          </div>
                       </div>
                       
                       <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <Activity size={18} className="text-electric animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-navy-900">Neural Sync Active</span>
                          </div>
                          <Zap size={16} className="text-success" />
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Quick Interface Access */}
            <div className="bg-navy-900 rounded-lg p-6 md:p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 md:p-8 text-white/5 pointer-events-none transition-transform group-hover:rotate-12">
                  <Zap size={100} className="md:w-[140px] md:h-[140px]" />
               </div>
               <h5 className="text-lg md:text-xl font-black italic uppercase tracking-tighter mb-4 relative z-10">Vault Intelligence</h5>
              <div className="space-y-4 relative z-10">
                 {[
                   { label: 'Cloud Perimeter', stat: 'Stable', color: 'text-success' },
                   { label: 'Vector Encoding', stat: '256-bit', color: 'text-electric' },
                   { label: 'Regional Keys', stat: 'Rotated', color: 'text-slate-400' },
                 ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-500">{item.label}</span>
                       <span className={item.color}>{item.stat}</span>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                 System Telemetry
              </button>
           </div>

           {/* SOC Terminal */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 md:p-10 shadow-sm hover:border-electric transition-all group cursor-pointer" onClick={() => navigate('/support')}>
               <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-lg flex items-center justify-center text-electric group-hover:bg-electric group-hover:text-white transition-all shrink-0">
                     <HistoryIcon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="space-y-1 min-w-0">
                     <h5 className="text-sm md:text-base font-black italic uppercase text-navy-900 leading-none">SOC Support</h5>
                     <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">Encrypted Direct Line</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
