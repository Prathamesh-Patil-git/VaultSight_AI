import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { ShieldAlert, Globe, Smartphone, Clock, ShieldX, User, ShieldCheck } from 'lucide-react';

const LoginAnomalies = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logins');
        // Filter for FAILED attempts
        const anomalies = response.data.filter(l => l.status === 'FAILED');
        setLogs(anomalies);
      } catch (err) {
        console.error('Login logs fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center p-20">
       <div className="w-12 h-12 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Identity Anomalies</h1>
          <p className="text-slate-500 font-medium">Monitoring suspicious authentication patterns and session hijacks.</p>
        </div>
        <div className="px-6 py-2 bg-warning/10 text-warning rounded-2xl border border-warning/20 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
           <ShieldAlert size={14} /> Intelligence Sync: active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {logs.length > 0 ? logs.map((item) => (
          <div key={item._id} className="bg-navy-800/50 p-10 rounded-[3rem] border border-navy-700/50 shadow-2xl relative overflow-hidden flex gap-10 backdrop-blur-xl group hover:border-warning/30 transition-all duration-500">
             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <ShieldX size={100} />
             </div>
             
             <div className="shrink-0 flex flex-col items-center">
                <div className="w-20 h-20 bg-navy-900 rounded-[2rem] border border-navy-700 flex items-center justify-center text-slate-400 mb-6 shadow-xl group-hover:text-electric transition-colors">
                   <User size={36} />
                </div>
                <div className="px-3 py-1 bg-danger text-white rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-danger/20">
                   {item.status}
                </div>
             </div>

             <div className="space-y-8 flex-1">
                <div>
                   <h3 className="text-2xl font-black text-white italic tracking-tight mb-2 group-hover:text-warning transition-colors">@{item.username}</h3>
                   <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} /> {new Date(item.createdAt).toLocaleString()}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500">
                         <Globe size={14} />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Target IP</span>
                      </div>
                      <p className="text-sm font-black text-slate-400 font-mono tracking-tighter">{item.ipAddress}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-500">
                         <Smartphone size={14} />
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminal</span>
                      </div>
                      <p className="text-sm font-black text-slate-400 truncate">{item.device ? item.device.split(' ')[0] : 'Unknown'}</p>
                   </div>
                </div>

                <div className="p-6 bg-navy-950/50 rounded-[1.5rem] border border-navy-800">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-3">Threat Diagnostic</p>
                   <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-electric pl-4 font-medium">
                      Authentication failure from unexpected node. Potential brute-force or identity takeover attempt detected at {item.ipAddress}.
                   </p>
                </div>

                <div className="flex gap-4">
                   <button className="flex-1 py-4 bg-navy-950 text-white border border-navy-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-navy-900 shadow-xl active:scale-95 transition-all">Neutralize IP</button>
                   <button className="flex-1 py-4 bg-electric text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-electric/20 hover:bg-blue-600 active:scale-95 transition-all">Challenge DNA</button>
                </div>
             </div>
          </div>
        )) : (
           <div className="col-span-full py-40 text-center bg-navy-800/20 rounded-[4rem] border-2 border-dashed border-navy-800 opacity-20 flex flex-col items-center gap-6">
              <ShieldCheck size={80} className="text-slate-500" />
              <p className="text-2xl font-black uppercase tracking-[0.4em] text-slate-500 italic">Identity Perimeter Sealed</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default LoginAnomalies;
