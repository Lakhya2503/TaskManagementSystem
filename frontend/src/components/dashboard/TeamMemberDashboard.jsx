import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiFileText, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils';
import {
  getTasks,
  updateTask,
  submitReport,
  getMyReports,
  getTeams
} from '../../api';

const TeamMemberDashboard = () => {
  const { workspaceId } = useParams();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('tasks'); // tasks | reports
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  
  // Report Form State
  const [reportForm, setReportForm] = useState({
    projectId: '',
    reportText: '',
    hoursWorked: ''
  });

  // Load My Tasks
  const loadTasks = useCallback(() => {
    requestHandler(
      () => getTasks({}), // The backend automatically filters to only the tasks assigned to this member
      setLoading,
      (res) => setTasks(res.data || res),
      (err) => console.error("Failed to load tasks", err)
    );
  }, []);

  // Load My Reports
  const loadReports = useCallback(() => {
    if (!workspaceId) return;
    requestHandler(
      () => getMyReports({}), // Backend filters to member's own reports
      setLoading,
      (res) => {
        // filter reports by current workspace if needed, but backend probably gives all for member.
        // We'll trust the backend response.
        setReports(res.data || res);
      },
      (err) => console.error("Failed to load reports", err)
    );
  }, [workspaceId]);

  // Load My Teams (to get available projects to report on)
  const loadMyTeams = useCallback(() => {
    if (!workspaceId || !user) return;
    requestHandler(
      () => getTeams({ workspaceId }),
      setLoading,
      (res) => {
        const allTeams = res.data || res;
        const memberTeams = allTeams.filter(t => 
          t.members?.some(m => (m._id || m) === user._id) || 
          (t.teamLeader?._id || t.teamLeader) === user._id
        );
        setMyTeams(memberTeams);
        if (memberTeams.length > 0 && memberTeams[0].projectId) {
           setReportForm(prev => ({ ...prev, projectId: memberTeams[0].projectId._id || memberTeams[0].projectId }));
        }
      },
      (err) => console.error("Failed to load teams", err)
    );
  }, [workspaceId, user]);

  useEffect(() => {
    loadMyTeams();
  }, [loadMyTeams]);

  useEffect(() => {
    if (activeTab === 'tasks') {
      loadTasks();
    } else {
      loadReports();
    }
  }, [activeTab, loadTasks, loadReports]);

  const handleUpdateStatus = (taskId, newStatus) => {
    requestHandler(
      () => updateTask(taskId, { status: newStatus }),
      setLoading,
      () => {
        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      },
      (err) => console.error("Failed to update task", err)
    );
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportForm.projectId) {
      alert("Please select a project.");
      return;
    }
    
    // Find team for this project
    const relevantTeam = myTeams.find(t => (t.projectId?._id || t.projectId) === reportForm.projectId);
    
    const payload = {
      ...reportForm,
      teamId: relevantTeam?._id, // Add teamId if backend expects it
      date: new Date().toISOString()
    };

    requestHandler(
      () => submitReport(payload),
      setLoading,
      (res) => {
        // Upsert behavior, so just reload reports to get accurate state
        loadReports();
        setReportForm(prev => ({ ...prev, reportText: '', hoursWorked: '' }));
        alert("Daily report submitted successfully!");
      },
      (err) => console.error("Failed to submit report", err)
    );
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const TaskCard = ({ task }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <FiClock className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
        
        <select
          value={task.status}
          onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${
            task.status === 'done' ? 'bg-green-100 text-green-800 focus:ring-green-500' :
            task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' :
            'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'
          }`}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Hello, {user?.name || user?.email}</p>
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
              <FiCheckCircle />
              My Tasks
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
              Log Daily Report
            </button>
          </nav>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Assigned Tasks ({tasks.length})</h2>
              <button 
                onClick={loadTasks}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
            
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <FiCheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">You're all caught up!</h3>
                <p className="text-gray-500 mt-1">No tasks are currently assigned to you.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Todo Column */}
                <div className="bg-gray-100/50 p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">To Do</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{todoTasks.length}</span>
                  </div>
                  <div className="space-y-4">
                    {todoTasks.map(t => <TaskCard key={t._id} task={t} />)}
                  </div>
                </div>

                {/* In Progress Column */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-800">In Progress</h3>
                    <span className="bg-blue-200 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{inProgressTasks.length}</span>
                  </div>
                  <div className="space-y-4">
                    {inProgressTasks.map(t => <TaskCard key={t._id} task={t} />)}
                  </div>
                </div>

                {/* Done Column */}
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-800">Done</h3>
                    <span className="bg-green-200 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{doneTasks.length}</span>
                  </div>
                  <div className="space-y-4">
                    {doneTasks.map(t => <TaskCard key={t._id} task={t} />)}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Submit Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Log Today's Work</h3>
                
                {myTeams.length === 0 ? (
                  <div className="text-yellow-700 bg-yellow-50 p-4 rounded-lg text-sm border border-yellow-200">
                    You need to be assigned to a project team before you can submit a daily report.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReport} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                      <select
                        required
                        value={reportForm.projectId}
                        onChange={(e) => setReportForm({...reportForm, projectId: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2"
                      >
                        {myTeams.map(t => (
                          <option key={t._id} value={t.projectId?._id || t.projectId}>
                            {t.projectId?.projectName || t.teamName + ' Project'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        required
                        value={reportForm.hoursWorked}
                        onChange={(e) => setReportForm({...reportForm, hoursWorked: e.target.value})}
                        placeholder="e.g. 8"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What did you complete?</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Detail your contributions and progress today..."
                        value={reportForm.reportText}
                        onChange={(e) => setReportForm({...reportForm, reportText: e.target.value})}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 resize-none"
                      ></textarea>
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        This updates your report for today.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                    >
                      {loading ? "Submitting..." : "Submit Report"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Reports History */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">My Recent Reports</h3>
                  <button onClick={loadReports} className="text-gray-500 hover:text-indigo-600">
                    <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {reports.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No reports submitted yet.
                    </div>
                  ) : (
                    reports.map(report => (
                      <div key={report._id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded font-medium mb-1">
                              {new Date(report.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                            <h4 className="font-semibold text-gray-900">{report.projectId?.projectName || 'Project Work'}</h4>
                          </div>
                          <span className="text-sm font-medium text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded shadow-sm">
                            {report.hoursWorked} hrs
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{report.reportText}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
};

export default TeamMemberDashboard;
