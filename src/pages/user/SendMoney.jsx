import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { 
  ChevronLeft, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  Zap,
  Activity,
  History,
  Info,
  HelpCircle
} from 'lucide-react';

const SendMoney = () => {
  const { user, fetchProfile } = useApp();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('form'); 
  const [result, setResult] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('Analyzing Risk...');
  const navigate = useNavigate();

  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!amount || !recipient) return;

    setStep('processing');
    setLoadingMsg('Scanning Vector Matrix...');
    
    try {
      const response = await api.post('user/transfer', {
        receiverUpiId: recipient,
        amount: parseFloat(amount),
        device: "Authorized Desktop Node",
        location: "Mumbai, IN", 
        note: "Secure Transfer"
      });

      setResult({
        status: 'success',
        title: 'Transfer Secure',
        message: response.message || `₹${amount} sent successfully.`,
        icon: <CheckCircle2 className="text-success" size={64} />
      });
      await fetchProfile();
    } catch (error) {
      if (error.blocked) {
        setResult({
            status: 'blocked',
            title: 'AUTONOMOUS LOCK',
            message: error.error || 'Account frozen due to high risk patterns.',
            icon: <ShieldAlert className="text-danger" size={64} />
          });
      } else {
        setResult({
            status: 'error',
            title: 'Transfer Failed',
            message: error.error || 'Neural check failed. Please try again.',
            icon: <AlertTriangle className="text-danger" size={64} />
          });
      }
    } finally {
      setStep('result');
    }
  };

  if (step === 'processing') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur rounded-[4rem] border border-white shadow-2xl animate-in fade-in duration-500">
        <div className="relative mb-10 scale-125">
           <div className="w-32 h-32 border-[8px] border-slate-100 rounded-full"></div>
           <div className="w-32 h-32 border-[8px] border-electric border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Activity className="text-electric animate-pulse" size={48} />
           </div>
        </div>
        <h2 className="text-3xl font-black text-navy-900 mb-4 italic uppercase tracking-tighter shadow-sm">{loadingMsg}</h2>
        <p className="text-slate-500 text-sm font-bold max-w-lg leading-relaxed italic">VaultSight AI is processing multidimensional embeddings to verify transaction intent and perimeter integrity.</p>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center p-12 text-center animate-in zoom-in duration-500 bg-white/50 backdrop-blur rounded-[4rem] border border-white shadow-2xl">
        <div className="mb-10 p-10 bg-slate-50 rounded-[3rem] border-4 border-white shadow-2xl relative">
           <div className="absolute -inset-2 bg-gradient-to-br from-electric/20 to-blue-500/10 blur-xl opacity-50"></div>
           <div className="relative z-10">{result.icon}</div>
        </div>
        <h2 className="text-4xl font-black text-navy-900 mb-4 italic uppercase tracking-tighter leading-none">{result.title}</h2>
        <p className={`font-bold text-base mb-14 max-w-md ${result.status === 'blocked' ? 'text-danger italic' : 'text-slate-500'}`}>
           {result.message}
        </p>
        <button 
           onClick={() => {
              if (result.status === 'success') navigate('/user/dashboard');
              else setStep('form');
           }}
           className="px-16 py-6 bg-navy-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] italic active:scale-95 transition-all shadow-2xl shadow-navy-900/30 hover:bg-electric"
        >
          {result.status === 'success' ? 'Return to Operations' : 'Reset Vector'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="p-4 bg-white rounded-3xl text-navy-900 hover:bg-slate-50 active:scale-90 transition-all border border-slate-200 shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <div className="space-y-1">
             <h1 className="text-4xl font-black text-navy-900 uppercase tracking-tighter italic">Funds Dispatch</h1>
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                <div className="w-2 h-2 bg-electric rounded-full"></div>
                Initializing Secure Protocol Matrix
             </div>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm">
           <div className="flex flex-col text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Credit</p>
              <p className="text-lg font-black text-navy-900 italic">₹{user.balance?.toLocaleString()}</p>
           </div>
           <div className="p-3 bg-electric/10 text-electric rounded-2xl">
              <Zap size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-12">
        {/* Main Form Area */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[4rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-electric/5 rounded-full blur-[80px]"></div>
           
           <form onSubmit={handleSend} className="space-y-12 relative z-10">
              <div className="space-y-4">
                 <label className="text-[11px] font-black text-navy-900 uppercase tracking-[0.4em] px-4 italic border-l-4 border-electric flex items-center gap-3">
                    Target Identity Handler
                    <Info size={14} className="text-slate-300" />
                 </label>
                 <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-electric transition-colors">
                       <Search size={24} />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter UPI ID (e.g. name@vaultsight)" 
                      className="w-full pl-16 pr-8 py-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black italic text-xl text-navy-900 placeholder:text-slate-200"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      required
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[11px] font-black text-navy-900 uppercase tracking-[0.4em] px-4 italic border-l-4 border-electric flex items-center gap-3">
                    Quantum Payload Quantity
                    <Zap size={14} className="text-slate-300" />
                 </label>
                 <div className="relative group">
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-6xl font-black text-electric/40 group-focus-within:text-electric transition-colors italic">₹</span>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full pl-24 pr-8 py-14 bg-slate-50 rounded-[3rem] border-2 border-slate-100 focus:border-electric focus:bg-white focus:ring-8 focus:ring-electric/5 outline-none transition-all font-black text-7xl italic text-navy-900 placeholder:text-slate-100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                 </div>
                 <div className="flex flex-wrap gap-4 px-2 pt-2">
                    {[500, 5000, 25000, 100000, 250000].map(val => (
                      <button 
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 hover:border-electric hover:text-white hover:bg-electric transition-all active:scale-95 shadow-sm"
                      >
                        ₹{val < 1000 ? val : (val/1000) + 'K'}
                      </button>
                    ))}
                 </div>
              </div>

              <button 
                type="submit"
                disabled={!amount || !recipient}
                className="w-full py-8 bg-navy-900 text-white rounded-[2.5rem] font-black italic text-xl uppercase tracking-[0.3em] flex items-center justify-center gap-6 hover:bg-electric transition-all shadow-2xl shadow-navy-900/40 mt-8 disabled:opacity-20 disabled:grayscale group active:scale-95"
              >
                Execute Secure Transfer
                <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-300" />
              </button>
           </form>
        </div>

        {/* Informational Sidebar Area */}
        <div className="col-span-12 lg:col-span-5 space-y-10">
           <div className="bg-navy-900 rounded-[3rem] p-10 text-white border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 text-electric/5 translate-x-1/4 -translate-y-1/4 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <ShieldAlert size={180} />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-electric/20 rounded-2xl border border-electric/20">
                       <Activity size={24} className="text-electric" />
                    </div>
                    <h5 className="text-xs font-black uppercase tracking-[0.4em] italic shadow-lg shadow-black">Security Protocol 2.4</h5>
                 </div>
                 <div className="space-y-6">
                    <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-2 border-electric pl-6">
                       Every transaction is verified using high-dimensional vector embeddings. 
                       Autonomous locking will initialize if the payload deviates from your historical behavior matrix.
                    </p>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Level</p>
                          <p className="text-sm font-black text-success uppercase italic">Negligible</p>
                       </div>
                       <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 p-10 shadow-sm space-y-8">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic text-center">Protocol Reminders</h5>
              <div className="space-y-6">
                 {[
                   { icon: <History size={20}/>, title: "Traceability", text: "All transfers generate immutable ledger entries within your neural history." },
                   { icon: <CheckCircle2 size={20}/>, title: "Auth-Node", text: "Verified credentials required for any dispatch exceeding ₹100,000." },
                   { icon: <HelpCircle size={20}/>, title: "Support", text: "Contact SOC analysts immediately for suspected interception." },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-5">
                      <div className="p-3 bg-slate-50 rounded-xl text-electric h-fit shadow-sm">{item.icon}</div>
                      <div className="space-y-1">
                         <h6 className="text-[11px] font-black text-navy-900 uppercase tracking-widest">{item.title}</h6>
                         <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{item.text}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
