import React, { useState } from 'react';
import {
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFilter,
  HiOutlineStar,
  HiOutlineLightBulb,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineUsers,
  HiOutlinePlay,
  HiOutlineFolder,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineCog,
} from "react-icons/hi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { MdOutlineAssignment, MdOutlineDashboard } from "react-icons/md";
import { RiTaskLine, RiProgress5Line, RiTimerLine, RiTeamLine } from "react-icons/ri";

const Home = () => {
  const [email, setEmail] = useState('');
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  // System hierarchy from PDF
  const hierarchy = [
    { role: 'Admin', level: 1, description: 'Superuser - Monitors entire system', icon: '👑', permissions: ['View all managers', 'View all interns', 'View all projects', 'View deadlines'] },
    { role: 'Manager', level: 2, description: 'Creates projects & manages teams', icon: '📊', permissions: ['Create projects', 'Set deadlines', 'Upload interns (CSV/Excel)', 'Create teams', 'Assign team leaders'] },
    { role: 'Team Leader', level: 3, description: 'Submits daily work reports', icon: '👥', permissions: ['View assigned project', 'View team members', 'Enter daily work', 'Submit reports'] },
    { role: 'Interns', level: 4, description: 'Team members under leaders', icon: '👨‍💻', permissions: ['No system access', 'Work under team leaders'] },
  ];

  // Key features from PDF
  const features = [
    {
      icon: <MdOutlineAssignment className="text-3xl" />,
      title: 'Project Management',
      description: 'Create and manage projects with deadlines. Track progress at every level.',
      details: ['Project creation', 'Deadline tracking', 'Progress monitoring'],
      color: 'from-blue-500 to-blue-600',
      image: '📋'
    },
    {
      icon: <HiOutlineUserGroup className="text-3xl" />,
      title: 'Bulk Intern Onboarding',
      description: 'Upload hundreds of interns via CSV/Excel with automatic validation.',
      details: ['CSV/Excel upload', 'Auto-validation', 'Duplicate checking'],
      color: 'from-blue-500 to-cyan-500',
      image: '📊'
    },
    {
      icon: <RiTeamLine className="text-3xl" />,
      title: 'Team Formation',
      description: 'Create teams and assign team leaders from intern pool.',
      details: ['Team creation', 'Leader assignment', 'Member management'],
      color: 'from-blue-500 to-purple-500',
      image: '👥'
    },
    {
      icon: <RiTaskLine className="text-3xl" />,
      title: 'Daily Work Reporting',
      description: 'Team leaders submit date-wise work reports for each member.',
      details: ['Date-wise entries', 'Member-wise logs', 'Status tracking'],
      color: 'from-blue-500 to-indigo-500',
      image: '📝'
    },
    {
      icon: <HiOutlineChartBar className="text-3xl" />,
      title: 'Monitoring Dashboard',
      description: 'Admins and managers get full visibility into project progress.',
      details: ['Project list', 'Deadline tracking', 'Expandable team view'],
      color: 'from-blue-500 to-green-500',
      image: '📈'
    },
    {
      icon: <HiOutlineCalendar className="text-3xl" />,
      title: 'Deadline Tracking',
      description: 'Never miss deadlines with clear tracking and alerts.',
      details: ['Set deadlines', 'Track progress', 'Overdue alerts'],
      color: 'from-blue-500 to-pink-500',
      image: '⏰'
    }
  ];

  // How it works steps based on PDF workflow
  const howItWorks = [
    {
      step: '01',
      title: 'Admin Creates Managers',
      description: 'Admin sets up manager accounts in the system.',
      icon: '👑'
    },
    {
      step: '02',
      title: 'Manager Creates Project',
      description: 'Manager creates project and sets deadline.',
      icon: '📋'
    },
    {
      step: '03',
      title: 'Bulk Intern Upload',
      description: 'Manager uploads interns via CSV/Excel.',
      icon: '📊'
    },
    {
      step: '04',
      title: 'Create Teams',
      description: 'Manager forms teams and assigns team leaders.',
      icon: '👥'
    },
    {
      step: '05',
      title: 'Daily Reporting',
      description: 'Team leaders submit daily work reports.',
      icon: '📝'
    },
    {
      step: '06',
      title: 'Monitor Progress',
      description: 'Admin & manager track all activities.',
      icon: '📈'
    }
  ];

  // Stats from system
  const stats = [
    { value: '500+', label: 'Active Projects', icon: '📋' },
    { value: '10K+', label: 'Interns Onboarded', icon: '👥' },
    { value: '50+', label: 'Team Leaders', icon: '👑' },
    { value: '95%', label: 'Deadline Compliance', icon: '🎯' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowSubscribeModal(true);
      setEmail('');
      setTimeout(() => setShowSubscribeModal(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HiOutlineSparkles className="text-lg" />
                <span>Task Management System for Organizations</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
                <span className="text-gray-900">
                  Manage Projects,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Track Daily Work
                </span>
              </h1>

              <p className="text-xl text-gray-500 mb-8 max-w-lg">
                A role-based web application to manage projects, teams, interns, and daily work reporting in a structured and transparent way.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {hierarchy.map((item, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-lg px-3 py-1 text-sm">
                    <span className="font-bold text-blue-600">{item.role}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="text-gray-500">Level {item.level}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-lg flex items-center gap-2 justify-center">
                  Get Started <HiOutlineArrowRight className="text-xl" />
                </button>
                <button className="border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all text-lg flex items-center gap-2 justify-center">
                  <HiOutlinePlay className="text-xl" /> View Demo
                </button>
              </div>
            </div>

            {/* Right side - Hierarchy visualization */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4">System Hierarchy Flow</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-medium">Admin</span>
                    <span className="text-sm text-gray-500 ml-auto">Superuser</span>
                  </div>
                  <div className="ml-6 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold">M</div>
                    <span className="font-medium">Manager</span>
                    <span className="text-sm text-gray-500 ml-auto">Creates projects</span>
                  </div>
                  <div className="ml-12 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">TL</div>
                    <span className="font-medium">Team Leader</span>
                    <span className="text-sm text-gray-500 ml-auto">Reports work</span>
                  </div>
                  <div className="ml-16 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">I</div>
                    <span className="font-medium">Interns</span>
                    <span className="text-sm text-gray-500 ml-auto">Team members</span>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-lg shadow-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <HiOutlineUsers className="text-blue-600" />
                  <span className="text-sm font-medium">Role-based access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-blue-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              System
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Capabilities</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Everything you need to manage projects, teams, and daily work reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className="text-4xl mb-4">{feature.image}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <HiOutlineCheckCircle className="text-green-500" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              System
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Workflow</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              How the task management system works from top to bottom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-blue-100 hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-blue-600">{step.step}</span>
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Role-Based
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Access Control</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Clear hierarchy with specific permissions for each role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {hierarchy.map((role, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-blue-100">
                <div className="text-3xl mb-3">{role.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{role.role}</h3>
                <p className="text-sm text-gray-500 mb-3">{role.description}</p>
                <ul className="space-y-1">
                  {role.permissions.map((perm, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-blue-600 mt-1">•</span>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Ready to Streamline Your Work?
          </h2>
          <p className="text-white/90 text-xl mb-10">
            Start managing projects, teams, and daily work reports efficiently.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap"
            >
              Request Demo
            </button>
          </form>

          <p className="text-white/70 text-sm mt-4">
            Free consultation • Setup assistance included
          </p>
        </div>
      </section>

      {/* Success Modal */}
      {showSubscribeModal && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-up z-50">
          <div className="flex items-center gap-3">
            <HiOutlineCheckCircle className="text-2xl" />
            <span className="font-medium">Thanks! Our team will contact you soon.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
