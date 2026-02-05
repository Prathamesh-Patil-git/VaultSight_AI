import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserPlus, Eye, Search, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import UserDetailModal from '../../components/UserDetailModal';
import api from '../../lib/api';

const UserManagement = () => {
  const { users, fetchUsers, registerNewUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    balance: '',
    customPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.accountNumber?.includes(searchTerm)
  );

  const handleUnlock = async (userId) => {
    try {
      await api.post(`/admin/unlock/${userId}`);
      fetchUsers();
      setIsViewModalOpen(false);
    } catch (err) {
      setError(err.message || 'Unlock failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const res = await registerNewUser(formData);
      setSuccess(`User registered! Credentials: ${res.data.generatedCredentials.username} / ${res.data.generatedCredentials.password}`);
      setFormData({ name: '', mobile: '', address: '', balance: '', customPassword: '' });
      // Don't close immediately so user can see credentials
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm font-medium">Manage registered customers and their autonomous security states.</p>
        </div>
        <button 
          onClick={() => {
            setError('');
            setSuccess('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-electric text-white px-5 py-3 rounded-2xl font-bold hover:bg-electric/90 shadow-xl shadow-electric/20 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          Register New Customer
        </button>
      </div>

      {/* Stats - Grid layout with premium cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: users.length, color: 'text-slate-900', bg: 'bg-white' },
          { label: 'System Active', value: users.filter(u => !u.isBlocked && !u.isLocked).length, color: 'text-success', bg: 'bg-success/5' },
          { label: 'Locked/Risk', value: users.filter(u => u.isLocked).length, color: 'text-warning', bg: 'bg-warning/5' },
          { label: 'Blocked/Admin', value: users.filter(u => u.isBlocked).length, color: 'text-danger', bg: 'bg-danger/5' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
            <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => fetchUsers()} className="px-4 py-2 text-xs font-bold text-electric bg-electric/10 rounded-xl hover:bg-electric/20 transition-all">Refresh Database</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-left">Customer Matrix</th>
                <th className="px-8 py-5 text-left">Financial Info</th>
                <th className="px-8 py-5 text-left">Vector Status</th>
                <th className="px-8 py-5 text-left">Risk State</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-medium italic">No customer records found in secure vault...</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center font-black text-electric text-lg shadow-inner">
                          {user.name?.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-black text-navy-900 text-lg group-hover:text-electric transition-colors">{user.name}</p>
                          <p className="text-xs font-bold text-slate-400 tracking-wider">MOD: {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-700">₹{user.balance?.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.upiId}</p>
                    </td>
                    <td className="px-8 py-5 font-mono text-xs text-slate-500">
                      {user.accountNumber}
                    </td>
                    <td className="px-8 py-5">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        !user.isBlocked && !user.isLocked ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${!user.isBlocked && !user.isLocked ? 'bg-success animate-pulse' : 'bg-danger'}`}></div>
                        {!user.isBlocked && !user.isLocked ? 'Autonomous' : user.isLocked ? 'Locked' : 'Blocked'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setIsViewModalOpen(true);
                        }}
                        className="p-3 text-slate-400 hover:text-electric hover:bg-electric/5 rounded-2xl transition-all"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser} 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        onUnlock={handleUnlock}
      />

      {/* Real Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/20">
            <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-navy-900 italic tracking-tighter">ADD REAL CUSTOMER</h3>
                <p className="text-sm text-slate-500 font-medium">Initialize a secure banking vault with neural protection.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-navy-900 transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleRegister}>
              <div className="p-10 grid grid-cols-2 gap-8">
                {error && <div className="col-span-2 p-4 bg-danger/10 border border-danger/20 rounded-2xl text-danger text-xs font-bold flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
                {success && <div className="col-span-2 p-4 bg-success/10 border border-success/20 rounded-2xl text-success text-xs font-bold flex items-center gap-2"><CheckCircle2 size={16} />{success}</div>}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none font-bold italic" 
                      placeholder="e.g. Shravani K" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Contact</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none font-bold italic" 
                      placeholder="+91 00000 00000" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Deposit (₹)</label>
                    <input 
                      type="number" 
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none font-bold italic" 
                      placeholder="e.g. 50000" 
                      value={formData.balance}
                      onChange={(e) => setFormData({...formData, balance: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent Address</label>
                    <textarea 
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none font-bold italic h-[115px] resize-none" 
                      placeholder="Residential history..."
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Set custom password..." 
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-electric/10 focus:border-electric outline-none font-bold italic"
                        value={formData.customPassword}
                        onChange={(e) => setFormData({...formData, customPassword: e.target.value})}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold italic leading-tight">Leave blank to auto-generate a secure neural key.</p>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 bg-slate-50 border-t border-slate-200 flex justify-end gap-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3.5 font-black text-slate-500 uppercase tracking-widest hover:text-navy-900 transition-colors">Abort</button>
                 <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="px-10 py-3.5 bg-navy-900 text-white font-black italic rounded-2xl shadow-xl shadow-navy-900/20 hover:bg-electric transition-all disabled:opacity-50"
                 >
                   {isSubmitting ? 'INITIALIZING SHIELD...' : 'DEPLOY CUSTOMER ACCOUNT'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
