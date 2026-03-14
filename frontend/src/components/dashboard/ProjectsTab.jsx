import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, formatDate, daysLeft } from '../../lib/api';
import { FiPlus, FiFolder, FiClock, FiCalendar, FiUser, FiCheckCircle, FiAlertCircle, FiX, FiLoader, FiEdit2 } from 'react-icons/fi';

const ProjectCard = ({ project, index, onEdit }) => {
  const days = daysLeft(project.deadline);
  const overdue = days !== null && days < 0;
  const urgent = days !== null && days >= 0 && days <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative group bg-white/5 border border-white/10 rounded-2xl p-5 overflow-hidden hover:bg-white/8 hover:border-indigo-500/30 transition-all duration-300 cursor-default"
    >
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-indigo-600/10 blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <FiFolder className="text-indigo-400" size={17} />
          </div>
          <h3 className="font-semibold text-white text-[15px] leading-tight line-clamp-1">{project.projectName}</h3>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${overdue ? 'bg-red-500/10 border-red-500/30 text-red-400' : urgent ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
            {overdue ? 'Overdue' : urgent ? `${days}d left` : 'On Track'}
          </span>
          <button onClick={() => onEdit(project)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white cursor-pointer hover:scale-110">
            <FiEdit2 size={13} />
          </button>
        </div>
      </div>
      {project.description && <p className="text-white/50 text-[13px] leading-relaxed mb-4 line-clamp-2">{project.description}</p>}
      <div className="flex flex-wrap gap-3 text-[12px] text-white/40">
        {project.startDate && <span className="flex items-center gap-1.5"><FiCalendar size={12} className="text-indigo-400" />{formatDate(project.startDate)}</span>}
        {project.deadline && <span className="flex items-center gap-1.5"><FiClock size={12} className={overdue ? 'text-red-400' : 'text-violet-400'} />Due {formatDate(project.deadline)}</span>}
        {project.createdBy?.name && <span className="flex items-center gap-1.5 ml-auto"><FiUser size={12} className="text-cyan-400" />{project.createdBy.name}</span>}
      </div>
    </motion.div>
  );
};

const EditProjectModal = ({ project, onClose, onUpdated }) => {
  const [form, setForm] = useState({ 
    projectName: project.projectName || '', 
    description: project.description || '', 
    startDate: project.startDate ? project.startDate.split('T')[0] : '', 
    deadline: project.deadline ? project.deadline.split('T')[0] : '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectName || !form.startDate || !form.deadline) return setError('Project name, start date and deadline are required.');
    setLoading(true);
    try {
      await api.patch(`/api/v1/tms/project/update/${project._id}`, form);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-white">Edit Project</h2><p className="text-white/40 text-sm">Update project details</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><FiX size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Project Name *</label><input name="projectName" value={form.projectName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 [color-scheme:dark]" /></div>
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Deadline *</label><input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 [color-scheme:dark]" /></div>
          </div>
          {error && <p className="text-red-400 text-[13px] flex items-center gap-2"><FiAlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const CreateProjectModal = ({ onClose, onCreated, showToast }) => {
  const [form, setForm] = useState({ projectName: '', description: '', startDate: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.projectName || !form.startDate || !form.deadline) return setError('Project name, start date and deadline are required.');
    setLoading(true);
    try {
      await api.post('/api/v1/tms/project/add/project', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="w-full max-w-lg bg-[#0f1117] border border-white/10 rounded-3xl p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div><h2 className="text-xl font-bold text-white">New Project</h2><p className="text-white/40 text-sm">Fill in details to create a project</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"><FiX size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Project Name *</label><input name="projectName" value={form.projectName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60" /></div>
          <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Start Date *</label><input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 [color-scheme:dark]" /></div>
            <div><label className="block text-white/60 text-[13px] mb-1.5 font-medium">Deadline *</label><input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500/60 [color-scheme:dark]" /></div>
          </div>
          {error && <p className="text-red-400 text-[13px] flex items-center gap-2"><FiAlertCircle size={14} />{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-medium hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/4 border border-white/8 rounded-2xl p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
    <div><p className="text-2xl font-bold text-white">{value}</p><p className="text-white/40 text-xs">{label}</p></div>
  </motion.div>
);

export const ProjectsTab = ({ user, showToast }) => {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/v1/tms/project/get/project');
      setProjects(res.data?.data || []);
    } catch {
      showToast('Could not load projects.', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const total = projects.length;
  const overdue = projects.filter((p) => daysLeft(p.deadline) < 0).length;
  const onTrack = total - overdue;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Projects" value={total} icon={FiFolder} color="bg-indigo-600/20 text-indigo-400" />
        <StatCard label="On Track" value={onTrack} icon={FiCheckCircle} color="bg-emerald-600/20 text-emerald-400" />
        <StatCard label="Overdue" value={overdue} icon={FiAlertCircle} color="bg-red-600/20 text-red-400" />
      </div>

      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-white">Projects</h2><p className="text-white/30 text-[13px]">{fetching ? 'Loading…' : `${total} projects`}</p></div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"><FiPlus size={16} />New Project</button>
      </div>

      {fetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="bg-white/4 border border-white/8 rounded-2xl h-40 animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5"><FiFolder size={28} className="text-indigo-400" /></div>
          <h3 className="text-white text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-white/30 text-sm max-w-xs mb-6">Create your first project and start managing work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => <ProjectCard key={p._id} project={p} index={i} onEdit={setEditingProject} />)}
        </div>
      )}

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onCreated={() => { showToast('Project created! 🎉'); fetchProjects(); }} showToast={showToast} />}
      {editingProject && <EditProjectModal project={editingProject} onClose={() => setEditingProject(null)} onUpdated={() => { showToast('Project updated! ✨'); fetchProjects(); }} />}
    </div>
  );
};
