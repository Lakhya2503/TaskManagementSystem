import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiUsers, FiX, FiCheckCircle, FiAlertCircle, FiLoader, FiPlus } from 'react-icons/fi';
import { api, formatDate } from '../../lib/api';

const UploadInternModal = ({ onClose, onUploaded, showToast }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a CSV file first.');
    const formData = new FormData();
    formData.append('bulkIntern', file);

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/v1/tms/intern/add/interns/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast(`Success: ${res.data?.data?.insertedInterns?.length || 0} interns added.`);
      onUploaded();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload CSV. Check format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-[#0f1117] border border-white/10 rounded-3xl p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Bulk Upload Interns</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><FiX size={18} /></button>
        </div>
        <form onSubmit={handleUpload}>
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors mb-4 relative">
             <input type="file" accept=".csv,.xlsx" onChange={(e)=>setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
             <FiUpload size={32} className="mx-auto text-indigo-400 mb-3" />
             <p className="text-white text-sm font-medium">{file ? file.name : 'Click or drag CSV/Excel here'}</p>
             <p className="text-white/40 text-xs mt-1">Columns: intern_id, name, email, joinDate, domain, role</p>
          </div>
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
          <div className="flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-white/10 text-white/60">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2">
               {loading ? <FiLoader className="animate-spin" /> : 'Upload'}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AddSingleInternModal = ({ onClose, onAdded, showToast }) => {
  const [form, setForm] = useState({ intern_id: '', name: '', email: '', joinDate: '', domain: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.intern_id || !form.name || !form.email || !form.joinDate || !form.domain) {
      return setError('All fields are required.');
    }
    
    // Convert YYYY-MM-DD to DD-MM-YYYY for backend format
    const [y, m, d] = form.joinDate.split('-');
    const formattedDate = `${d}-${m}-${y}`;

    setLoading(true);
    try {
      await api.post('/api/v1/tms/intern/add/single', { ...form, joinDate: formattedDate });
      showToast('Intern added successfully! 🎉');
      onAdded();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add intern.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-white">Add Single Intern</h2><p className="text-white/40 text-sm">Manually register an intern</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><FiX size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Intern ID *</label><input name="intern_id" value={form.intern_id} onChange={handleChange} placeholder="e.g. INT001" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Domain *</label><input name="domain" value={form.domain} onChange={handleChange} placeholder="e.g. Frontend" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
          </div>
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Full Name *</label><input name="name" value={form.name} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Email Address *</label><input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Joining Date *</label><input type="date" name="joinDate" value={form.joinDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 [color-scheme:dark]" /></div>
          
          {error && <p className="text-red-400 text-[13px] flex items-center gap-2"><FiAlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : 'Add Intern'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const InternsTab = ({ showToast }) => {
  const [interns, setInterns] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);

  const fetchInterns = async () => {
    try {
      const res = await api.get('/api/v1/tms/intern/get/all/interns');
      setInterns(res.data?.data || []);
    } catch {
      showToast('Could not load interns.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchInterns(); }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-white">All Interns</h2><p className="text-white/30 text-[13px]">{fetching ? 'Loading...' : `${interns.length} total interns`}</p></div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSingleModal(true)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"><FiPlus size={16} />Add Intern</button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"><FiUpload size={16} />Upload CSV</button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {fetching ? (
          <div className="p-8 text-center text-white/50"><FiLoader className="animate-spin mx-auto mb-2" />Loading interns...</div>
        ) : interns.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers size={32} className="mx-auto text-white/20 mb-3" />
            <p className="text-white font-semibold">No interns found</p>
            <p className="text-white/40 text-sm mt-1">Upload a CSV file to add interns</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0f1117] sticky top-0 border-b border-white/10 z-10 shadow-sm shadow-black/20">
                <tr>
                  <th className="px-5 py-4 font-medium text-white/60">ID</th>
                  <th className="px-5 py-4 font-medium text-white/60">Name</th>
                  <th className="px-5 py-4 font-medium text-white/60">Email</th>
                  <th className="px-5 py-4 font-medium text-white/60">Domain</th>
                  <th className="px-5 py-4 font-medium text-white/60">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {interns.map(inv => (
                  <tr key={inv._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4 text-white/80">{inv.internId}</td>
                    <td className="px-5 py-4 font-medium text-white">{inv.name}</td>
                    <td className="px-5 py-4 text-white/60">{inv.email}</td>
                    <td className="px-5 py-4"><span className="px-2 py-1 rounded bg-white/10 text-xs text-white/80">{inv.domain}</span></td>
                    <td className="px-5 py-4 text-white/60">{formatDate(inv.joiningDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <UploadInternModal onClose={() => setShowModal(false)} onUploaded={fetchInterns} showToast={showToast} />}
      {showSingleModal && <AddSingleInternModal onClose={() => setShowSingleModal(false)} onAdded={fetchInterns} showToast={showToast} />}
    </div>
  );
};
