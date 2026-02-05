import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, ShieldAlert, Cpu, Info, ArrowRight } from 'lucide-react';

const SemanticSearch = () => {
  const { threats } = useApp();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searchMode, setSearchMode] = useState('Semantic');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
      // Small delay to ensure state is set
      setTimeout(() => {
        const fakeEvent = { preventDefault: () => {} };
        handleSearch(fakeEvent, urlQuery);
      }, 500);
    }
  }, []);

  const handleSearch = (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const activeQuery = overrideQuery || query;
    if (!activeQuery) return;

    setIsSearching(true);
    // Simulate vector search latency
    setTimeout(() => {
      // Mock result sorting based on query keywords for demo
      const mockResults = threats.filter(t => 
        t.description.toLowerCase().includes(activeQuery.toLowerCase()) || 
        t.riskLevel.toLowerCase() === activeQuery.toLowerCase()
      ).map(t => ({
        ...t,
        similarity: (85 + Math.random() * 12).toFixed(2),
        matches: [activeQuery]
      }));
      
      setResults(mockResults);
      setIsSearching(false);
    }, 1200);
  };


  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Semantic Threat Search</h1>
          <p className="text-slate-500 font-medium">Identify latent threat patterns using AI vector embeddings.</p>
        </div>
        <div className="bg-electric/10 px-4 py-2 rounded-xl border border-electric/20 flex gap-2 items-center group cursor-pointer">
           <Info size={18} className="text-electric" />
           <div className="text-xs text-slate-400 group-hover:text-white transition-colors">
              <span className="font-bold text-electric uppercase">Demo Note:</span> Simulating MongoDB Atlas Vector Search (384-dims)
           </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-navy-800 p-10 rounded-[2.5rem] border border-navy-700 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-electric/5 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-danger/5 rounded-full blur-[100px]"></div>
        
        <form onSubmit={handleSearch} className="relative z-10 space-y-6 max-w-3xl mx-auto text-center">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-navy-900 rounded-full border border-navy-600 mb-4">
              <Sparkles size={14} className="text-electric" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Powered by Sentence-Transformers</span>
           </div>
           <h2 className="text-3xl font-bold text-white mb-8">What are you looking for?</h2>
           
           <div className="relative group">
              <div className="absolute inset-0 bg-electric blur-2xl opacity-10 group-focus-within:opacity-25 transition-opacity duration-500"></div>
              <div className="relative flex gap-3">
                 <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                    <input 
                      type="text" 
                      placeholder="e.g. Unusual transfers from VPN in Mumbai..." 
                      className="w-full pl-16 pr-6 py-6 bg-navy-900 rounded-[2rem] border-2 border-navy-700 text-xl text-white focus:border-electric outline-none transition-all shadow-2xl placeholder:text-slate-700"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                 </div>
                 <button 
                   type="submit"
                   className="px-10 py-6 bg-electric text-white rounded-[2rem] font-bold text-xl hover:bg-blue-600 transition-all shadow-xl shadow-electric/20 active:scale-95 flex items-center gap-2"
                 >
                   {isSearching ? <Cpu className="animate-spin" size={24}/> : 'Search'}
                 </button>
              </div>
           </div>

           <div className="flex items-center justify-center gap-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Search Mode:</span>
              <div className="flex bg-navy-900 p-1 rounded-xl border border-navy-700">
                 {['Exact', 'Semantic', 'Hybrid'].map(mode => (
                   <button 
                     key={mode}
                     type="button"
                     onClick={() => setSearchMode(mode)}
                     className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${searchMode === mode ? 'bg-navy-700 text-electric shadow-lg' : 'text-slate-500 hover:bg-navy-800'}`}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
           </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {isSearching ? (
          <div className="grid grid-cols-3 gap-6">
             {[1,2,3].map(i => (
               <div key={i} className="bg-navy-800/40 border border-navy-700 h-64 rounded-[2rem] animate-pulse"></div>
             ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Neural Match Results ({results.length})</h3>
               <span className="text-xs text-slate-600 font-medium italic">Embeddings queried in 14.2ms</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {results.map((res, i) => (
                 <div key={i} className="bg-navy-800 border border-navy-700 p-8 rounded-[2rem] hover:border-electric transition-all shadow-xl group hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-2">
                          <Cpu size={16} className="text-electric" />
                          <span className="text-lg font-black text-white">{res.similarity}%</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match</span>
                       </div>
                       <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                         res.riskLevel === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/20' : 'bg-warning/20 text-warning border border-warning/20'
                       }`}>
                         {res.riskLevel}
                       </div>
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed mb-6 group-hover:text-white transition-colors">
                       {res.description.split(' ').map((word, idx) => (
                         <span key={idx} className={res.matches.some(m => word.toLowerCase().includes(m.toLowerCase())) ? 'bg-electric/20 text-electric px-0.5 rounded' : ''}>
                           {word}{' '}
                         </span>
                       ))}
                    </p>
                    <div className="flex items-center gap-4 pt-6 border-t border-navy-700">
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Impacted User</p>
                          <p className="text-xs font-bold text-slate-300 truncate">{res.userName}</p>
                       </div>
                       <button className="p-3 bg-navy-900 border border-navy-700 rounded-2xl text-slate-400 group-hover:text-electric group-hover:border-electric transition-all">
                          <ArrowRight size={20} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </>
        ) : query && !isSearching ? (
          <div className="py-24 text-center">
             <div className="inline-flex p-8 bg-navy-800 rounded-[3rem] border-2 border-navy-700 mb-6 text-slate-700">
                <ShieldAlert size={64} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">No Similar TTPs Found</h3>
             <p className="text-slate-500 max-w-md mx-auto">This specific threat signature does not match any known malicious clusters in our vector database.</p>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-12">
             <div className="grid grid-cols-3 gap-8 max-w-4xl opacity-40">
                {[
                  { tag: 'PATTERN', desc: 'Find account takeover clusters via IP sequence analysis' },
                  { tag: 'BEHAVIOR', desc: 'Identify dormant accounts activated via small UPI probes' },
                  { tag: 'GEOSPATIAL', desc: 'Detect velocity anomalies across Mumbai/Pune corridor' },
                ].map((hint, i) => (
                  <div key={i} className="bg-navy-800/20 p-6 rounded-3xl border border-navy-700 text-center space-y-3">
                     <span className="text-[10px] font-black text-electric tracking-[0.2em]">{hint.tag}</span>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">{hint.desc}</p>
                  </div>
                ))}
             </div>
             <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">AI Sequence Matrix Scanning: IDLE</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemanticSearch;
