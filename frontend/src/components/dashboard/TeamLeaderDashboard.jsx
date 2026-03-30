import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiPlus, FiCalendar, FiClock, FiCheck, FiX, FiUsers, FiList, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils';
import {
  getTeams,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTeamReports
} from '../../api';

const TeamLeaderDashboard = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('tasks'); // tasks | reports
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Data states
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  
  // UI states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    description: '',
    remark: ''
  });

  // Load teams led by current user
  useEffect(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getTeams({ workspaceId }),
      setLoading,
      (res) => {
        const allTeams = res.data || res;
        // Filter teams where user is the teamLeader
        const ledTeams = allTeams.filter(t => 
          t.teamLeader?._id === user._id || t.teamLeader === user._id
        );
        setTeams(ledTeams);
        if (ledTeams.length > 0) {
          setSelectedTeam(ledTeams[0]);
        }
      },
      (err) => console.error("Failed to load teams", err)
    );
  }, [workspaceId, user._id]);

  // Load tasks when a team is selected
  const loadTasks = useCallback(() => {
    if (!selectedTeam) return;
    requestHandler(
      () => getTasks({ teamId: selectedTeam._id }),
      setLoading,
      (res) => setTasks(res.data || res),
      (err) => console.error("Failed to load tasks", err)
    );
  }, [selectedTeam]);

  // Load reports when a team is selected
  const loadReports = useCallback(() => {
    if (!selectedTeam) return;
    requestHandler(
      () => getTeamReports(selectedTeam._id, {}),
      setLoading,
      (res) => setReports(res.data || res),
      (err) => console.error("Failed to load reports", err)
    );
  }, [selectedTeam]);

  useEffect(() => {
    if (activeTab === 'tasks') {
      loadTasks();
    } else if (activeTab === 'reports') {
      loadReports();
    }
  }, [activeTab, loadTasks, loadReports]);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    
    const payload = {
      ...taskForm,
      projectId: selectedTeam.projectId?._id || selectedTeam.projectId,
      teamId: selectedTeam._id
    };

    requestHandler(
      () => createTask(payload),
      setLoading,
      (res) => {
        setTasks(prev => [res.data, ...prev]);
        setShowTaskModal(false);
        setTaskForm({ title: '', assignedTo: '', dueDate: '', description: '', remark: '' });
      },
      (err) => console.error("Failed to create task", err)
    );
  };

  const handleUpdateTaskStatus = (taskId, status) => {
    requestHandler(
      () => updateTask(taskId, { status }),
      setLoading,
      (res) => {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
      },
      (err) => console.error("Failed to update status", err)
    );
  };

  const handleDeleteTask = (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    requestHandler(
      () => deleteTask(taskId),
      setLoading,
      () => {
        setTasks(prev => prev.filter(t => t._id !== taskId));
      },
      (err) => console.error("Failed to delete task", err)
    );
  };

  if (!teams.length && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
          <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Teams Managed</h2>
          <p className="text-gray-600">You are not currently assigned as a Team Leader to any teams in this workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Team Leader Dashboard</h1>
            
            {/* Team Selector */}
            {teams.length > 1 && (
              <select
                value={selectedTeam?._id || ''}
                onChange={(e) => setSelectedTeam(teams.find(t => t._id === e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white px-4 py-2"
              >
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.teamName}</option>
                ))}
              </select>
            )}
          </div>
          
          {selectedTeam && (
            <div className="mt-2 text-sm text-gray-500">
              Managing team: <span className="font-semibold text-gray-700">{selectedTeam.teamName}</span>
              <span className="mx-2">•</span>
              Project: <span className="font-semibold text-gray-700">{selectedTeam.projectId?.projectName || 'No Project'}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`${
                activeTab === 'tasks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <FiList />
              Team Tasks
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`${
                activeTab === 'reports'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <FiFileText />
              Daily Reports
            </button>
          </nav>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowTaskModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <FiPlus />
                Assign New Task
              </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden text-left">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No tasks assigned yet.</td></tr>
                  ) : tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.assignedTo?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{task.assignedTo?.email || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${
                            task.status === 'done' ? 'bg-green-100 text-green-800' :
                            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDeleteTask(task._id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Completed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No reports submitted yet.</td></tr>
                  ) : reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(report.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{report.memberId?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.hoursWorked} hrs
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {report.reportText}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-left">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Assign New Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-500">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assign To</label>
                <select
                  required
                  value={taskForm.assignedTo}
                  onChange={e => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a member...</option>
                  {/* Map over team members */}
                  {selectedTeam?.team?.map(memberId => (
                    // We only have the ID here usually, unless populated. If it's an object:
                    <option key={memberId._id || memberId} value={memberId._id || memberId}>
                      {memberId.name || memberId.email || memberId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskForm.dueDate}
                  onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeamLeaderDashboard;
