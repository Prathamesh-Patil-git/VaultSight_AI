import React from 'react';
import { chartData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Globe, Clock, Smartphone, AlertTriangle, ShieldCheck } from 'lucide-react';

const RiskAnalysis = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Risk Analysis Matrix</h1>
        <p className="text-slate-500 font-medium">Deep dive into heuristic weights and user-specific risk distributions.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Top 10 Users by Risk */}
        <div className="col-span-8 bg-navy-800/50 p-8 rounded-[2.5rem] border border-navy-700 shadow-2xl h-[450px]">
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Top Users by Cumulative Risk Score</h3>
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.topRiskUsers} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                 <XAxis type="number" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                 <YAxis type="category" dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} width={80} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                   cursor={{ fill: '#1e293b' }}
                 />
                 <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={30}>
                    {chartData.topRiskUsers.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#EF4444' : entry.score > 40 ? '#F59E0B' : '#3B82F6'} />
                    ))}
                 </Bar>
              </BarChart>
           </ResponsiveContainer>
        </div>

        {/* Risk Factors Breakdown */}
        <div className="col-span-4 space-y-4">
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest px-2 mb-4">Risk Weight Factors</h3>
           {[
             { label: 'New Location', weight: 30, icon: <Globe size={18} className="text-blue-400"/> },
             { label: 'High Amount', weight: 25, icon: <ShieldCheck size={18} className="text-orange-400"/> },
             { label: 'New Device', weight: 20, icon: <Smartphone size={18} className="text-success"/> },
             { label: 'Unusual Time', weight: 15, icon: <Clock size={18} className="text-purple-400"/> },
             { label: 'Failed Auth', weight: 10, icon: <AlertTriangle size={18} className="text-danger"/> },
           ].map((factor, i) => (
             <div key={i} className="bg-navy-800/50 p-5 rounded-[1.5rem] border border-navy-700 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-navy-900 rounded-lg">{factor.icon}</div>
                      <span className="text-sm font-bold text-white uppercase tracking-tight">{factor.label}</span>
                   </div>
                   <span className="text-xs font-black text-slate-500">{factor.weight}%</span>
                </div>
                <div className="bg-navy-900 h-1.5 rounded-full overflow-hidden">
                   <div className="bg-electric h-full" style={{width: `${factor.weight}%`}}></div>
                </div>
             </div>
           ))}
        </div>
      </div>

       {/* Heatmap Simulation Table */}
       <div className="bg-navy-800/50 p-8 rounded-[2.5rem] border border-navy-700 shadow-2xl">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Risk by Location × Time of Day</h3>
          <div className="overflow-x-auto">
             <table className="w-full">
                <thead>
                   <tr>
                      <th className="p-4"></th>
                      {['Morning', 'Afternoon', 'Evening', 'Night'].map(t => (
                        <th key={t} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{t}</th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {['Mumbai', 'Delhi', 'Bangalore', 'Remote/VPN'].map(loc => (
                     <tr key={loc}>
                        <td className="p-4 text-sm font-bold text-slate-300">{loc}</td>
                        {[1,2,3,4].map(i => {
                           const risk = Math.floor(Math.random() * 100);
                           return (
                             <td key={i} className="p-2">
                                <div 
                                  className={`h-12 rounded-xl flex items-center justify-center font-black text-xs border ${
                                    risk > 80 ? 'bg-danger/40 border-danger/60 text-danger' : 
                                    risk > 50 ? 'bg-warning/30 border-warning/50 text-warning' : 
                                    'bg-success/20 border-success/40 text-success'
                                  }`}
                                  title={`Risk Score: ${risk}`}
                                >
                                   {risk}
                                </div>
                             </td>
                           );
                        })}
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default RiskAnalysis;
