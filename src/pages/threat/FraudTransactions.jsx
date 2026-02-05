import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ShieldAlert, MapPin, Smartphone, ArrowRight, Eye, AlertCircle, Clock, ShieldX } from 'lucide-react';
import TransactionDetailModal from '../../components/TransactionDetailModal';

const FraudTransactions = () => {
  const [fraudTxns, setFraudTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState(null);

  useEffect(() => {
    const fetchFraud = async () => {
      try {
        const response = await api.get('/admin/transactions');
        // Only show FLAGGED or HIGH risk
        const filtered = response.data.filter(t => t.riskLevel === 'HIGH' || t.status === 'FLAGGED');
        setFraudTxns(filtered);
      } catch (err) {
        console.error('Fraud logs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFraud();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Anomalous Signal Audit</h1>
          <p className="text-slate-500 font-medium">Critical analysis of all high-risk financial trajectories.</p>
        </div>
        <div className="px-6 py-2 bg-danger/10 text-danger rounded-2xl border border-danger/20 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
           <ShieldAlert size={14} /> Focus Mode Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fraudTxns.length > 0 ? fraudTxns.map((txn) => (
          <div key={txn._id} className="bg-navy-800/50 border border-navy-700/50 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-danger/30 transition-all duration-500">
             <div className="p-8 bg-navy-900/80 border-b border-navy-700/50 flex justify-between items-center">
                <span className="text-[10px] font-black text-electric tracking-[0.2em] uppercase">{txn.transactionId.slice(-12)}</span>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${txn.riskLevel === 'HIGH' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                   <AlertCircle size={12} />
                   <span className="text-[9px] font-black uppercase tracking-widest">{txn.riskLevel}</span>
                </div>
             </div>
             <div className="p-10 space-y-8">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Subject Handle</p>
                   <h3 className="text-2xl font-black text-white italic tracking-tight truncate">{txn.senderUpiId}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                   <div className="bg-navy-900/80 p-5 rounded-[1.5rem] border border-navy-700/50">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Amount</p>
                      <p className="text-xl font-black text-white italic">₹{txn.amount?.toLocaleString()}</p>
                   </div>
                   <div className="bg-navy-900/80 p-5 rounded-[1.5rem] border border-navy-700/50">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Neural Risk</p>
                      <p className="text-xl font-black text-danger italic">{txn.riskScore}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-300 transition-colors">
                      <MapPin size={18} className="text-slate-600" />
                      <span className="text-xs font-bold uppercase tracking-widest">{txn.location || 'Encrypted Geo'}</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-300 transition-colors">
                      <Smartphone size={18} className="text-slate-600" />
                      <span className="text-xs font-bold uppercase tracking-widest">{txn.device || 'Direct API Node'}</span>
                   </div>
                   <div className="flex items-center gap-4 text-slate-400 group-hover:text-slate-300 transition-colors">
                      <Clock size={18} className="text-slate-600" />
                      <span className="text-xs font-bold">{new Date(txn.createdAt).toLocaleString()}</span>
                   </div>
                </div>

                <div className="pt-8 border-t border-navy-700/50 flex gap-4">
                   <button 
                     onClick={() => setSelectedTxn(txn)}
                     className="flex-1 py-4 bg-electric text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-electric/20 active:scale-95 transition-all"
                   >
                     Audit Node
                   </button>
                   <button 
                     onClick={() => setSelectedTxn(txn)}
                     className="p-4 bg-navy-950 text-slate-500 rounded-2xl hover:text-white transition-colors border border-navy-800"
                   >
                      <Eye size={20} />
                   </button>
                </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-40 flex flex-col items-center gap-6 opacity-30">
             <ShieldX size={80} className="text-slate-500" />
             <p className="text-xl font-black uppercase tracking-[0.4em] text-slate-500">Zero Critical Anomalies</p>
          </div>
        )}
      </div>

      <TransactionDetailModal 
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  );
};

export default FraudTransactions;
