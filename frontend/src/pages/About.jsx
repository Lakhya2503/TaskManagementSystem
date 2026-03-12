import React from 'react';
import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineGlobe,
  HiOutlineHeart,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineUser,
  HiOutlineChat,
} from "react-icons/hi";
import { HiOutlineRocketLaunch } from "react-icons/hi2";


const About = () => {
  // Company story aligned with task management system
  const timeline = [
    {
      year: '2022',
      title: 'The Beginning',
      description: 'Started as an internal tool to manage interns and projects at a tech company.',
      icon: '🚀',
      color: 'from-blue-400 to-blue-600'
    },
    {
      year: '2023',
      title: 'First Enterprise Client',
      description: 'Onboarded first enterprise client with 500+ interns and 50+ projects.',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      year: '2024',
      title: 'Bulk Upload Feature',
      description: 'Launched CSV/Excel upload capability for rapid intern onboarding.',
      icon: '📊',
      color: 'from-blue-500 to-purple-500'
    },
    {
      year: '2025',
      title: 'Role-Based Access',
      description: 'Implemented complete role-based hierarchy with Admin, Manager, Team Leader structure.',
      icon: '👥',
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  // Core values based on system philosophy
  const values = [
    {
      icon: <HiOutlineShieldCheck className="text-3xl" />,
      title: 'Structured Hierarchy',
      description: 'Clear role definitions and responsibilities from Admin to Interns.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <HiOutlineGlobe className="text-3xl" />,
      title: 'Transparent Reporting',
      description: 'Complete visibility into project progress and daily work reports.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <HiOutlineLightBulb className="text-3xl" />,
      title: 'Efficient Onboarding',
      description: 'Bulk intern upload via CSV/Excel saves hours of manual work.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <HiOutlineHeart className="text-3xl" />,
      title: 'Deadline Focus',
      description: 'Every project has clear deadlines with tracking and alerts.',
      color: 'from-red-400 to-pink-500'
    }
  ];

  // Team structure
  const team = [
    {
      name: 'Michael Chen',
      role: 'Founder & CEO',
      bio: 'Former project manager who saw the need for better intern management systems.',
      avatar: 'MC',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Product',
      bio: 'Designed the role-based workflow after working with 50+ organizations.',
      avatar: 'SJ',
      color: 'from-purple-600 to-blue-600'
    },
    {
      name: 'Rahul Sharma',
      role: 'Technical Architect',
      bio: 'Built the secure authentication and role-based access control system.',
      avatar: 'RS',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Priya Patel',
      role: 'Customer Success',
      bio: 'Helps organizations implement the hierarchy and onboard their teams.',
      avatar: 'PP',
      color: 'from-orange-500 to-red-500'
    }
  ];

  // Company milestones
  const milestones = [
    { number: '100+', label: 'Organizations', icon: '🏢' },
    { number: '50K+', label: 'Interns Managed', icon: '👥' },
    { number: '5K+', label: 'Projects Completed', icon: '📋' },
    { number: '1M+', label: 'Daily Reports', icon: '📝' },
    { number: '99.9%', label: 'Uptime', icon: '⏱️' },
    { number: '24/7', label: 'Support', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HiOutlineUsers className="text-lg" />
            <span>Our Mission</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-gray-900">
              Structured Task Management
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              for Growing Organizations
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-8">
            We built this system to solve the chaos of managing interns, projects, and daily work reports.
            What started as an internal tool is now helping 100+ organizations maintain transparency and meet deadlines.
          </p>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-8 border-t border-blue-100">
            {milestones.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xl md:text-2xl font-black text-gray-900">{item.number}</div>
                <div className="text-xs md:text-sm text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Our
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Journey</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              From internal tool to enterprise solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl mb-4`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-blue-600">{item.year}</span>
                <h3 className="font-bold text-gray-800 mt-1 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              What
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Drives Us</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Core principles behind our task management system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Meet the
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Team</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              The people behind your task management system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all group">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-2xl mb-4 group-hover:scale-110 transition-transform mx-auto`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-gray-800 text-center">{member.name}</h3>
                <p className="text-sm text-blue-600 text-center mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm text-center">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <HiOutlineRocketLaunch className="text-6xl text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join 100+ organizations using our system to manage interns and projects.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
            Contact Our Team
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
