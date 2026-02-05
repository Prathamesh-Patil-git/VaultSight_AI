import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Unlock, ShieldAlert, User, MapPin, Clock } from 'lucide-react';

const AutoLockEvents = () => {
  const { users } = useApp();
  const lockedUsers = users.filter(u => u.status === 'Locked' || u.status === 'Blocked');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Auto-Lock Lifecycle</h1>
          <p className="text-slate-500 font-medium">Timeline of automated active-defense events.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
           {[
             { label: 'Today', val: 12, col: 'text-danger' },
             { label: 'Active', val: lockedUsers.length, col: 'text-warning' },
             { label: 'False Pos', val: '2%', col: 'text-success' },
           ].map((s, i) => (
             <div key={i} className="bg-navy-800 px-6 py-2 rounded-xl border border-navy-700 text-center">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
                <p className={`text-xl font-black ${s.col}`}>{s.val}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-6">
        {lockedUsers.map((user, i) => (
          <div key={i} className="bg-navy-800/40 p-8 rounded-[2.5rem] border border-navy-700 flex items-center gap-10 hover:bg-navy-800/60 transition-all border-l-8 border-l-danger shadow-2xl">
             <div className="shrink-0">
                <div className="w-20 h-20 bg-danger/10 rounded-[2rem] border border-danger/20 flex items-center justify-center text-danger shadow-2xl shadow-danger/20">
                   <Lock size={40} />
                </div>
             </div>
             
             <div className="flex-1 grid grid-cols-4 gap-8">
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">User Identifier</p>
                   <p className="text-lg font-bold text-white">{user.name}</p>
                   <p className="text-xs text-slate-400 font-mono italic">{user.accountNumber}</p>
                </div>
                
                <div className="col-span-2">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Trigger Signature</p>
                   <p className="text-sm text-slate-200 bg-navy-900/50 p-3 rounded-xl border border-navy-700 leading-relaxed italic">
                      {user.lockReason || 'Automated block due to velocity limit violation detected in Mumbai/Pune corridor.'}
                   </p>
                </div>

                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Action Metadata</p>
                   <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                         <Clock size={14} className="text-slate-600" /> {user.lockedAt ? new Date(user.lockedAt).toLocaleTimeString() : '02:15 PM'}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                         <MapPin size={14} className="text-slate-600" /> Unknown Hub
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-2 shrink-0">
                <button className="px-6 py-2 bg-navy-900 text-white border border-navy-700 rounded-xl text-xs font-bold hover:bg-navy-800 transition-all">Review Protocol</button>
                <button className="px-6 py-2 bg-electric/10 text-electric border border-electric/20 rounded-xl text-xs font-bold hover:bg-electric text-white transition-all">Quick Investigate</button>
             </div>
          </div>
        ))}

        {lockedUsers.length === 0 && (
          <div className="bg-navy-900 border-2 border-dashed border-navy-800 p-20 rounded-[3rem] text-center flex flex-col items-center gap-4 opacity-30">
             <ShieldAlert size={64} />
             <p className="text-xl font-bold uppercase tracking-widest">No Active Locked States</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoLockEvents;
