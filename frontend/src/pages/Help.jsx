import React, { useState } from 'react';
import {
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineQuestionMarkCircle,
  HiOutlineBookOpen,
  HiOutlineVideoCamera,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineChat,
  HiOutlineUsers,
  HiOutlinePlay,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { MdOutlineAssignment, MdOutlineHelp } from "react-icons/md";
import { RiTaskLine, RiTeamLine } from "react-icons/ri";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Help categories based on system modules
  const categories = [
    { id: 'all', name: 'All Help', icon: '📚', count: 20 },
    { id: 'admin', name: 'Admin Guide', icon: '👑', count: 5 },
    { id: 'manager', name: 'Manager Guide', icon: '📊', count: 6 },
    { id: 'team-leader', name: 'Team Leader Guide', icon: '👥', count: 4 },
    { id: 'projects', name: 'Projects & Deadlines', icon: '📋', count: 5 },
  ];

  // FAQ data based on system
  const faqs = [
    {
      id: 1,
      category: 'admin',
      question: 'How do I add a new manager?',
      answer: 'As an Admin, go to Manager Management > Add Manager. Enter their details including name, email, and phone. They will receive login credentials via email.',
      helpful: 156
    },
    {
      id: 2,
      category: 'manager',
      question: 'How do I upload interns via CSV?',
      answer: 'Go to Intern Management > Upload. Download the template, fill in the required fields (Name, Email, Phone, UniqueID, JoiningDate, Domain), and upload the CSV/Excel file. The system will validate and import all records.',
      helpful: 234
    },
    {
      id: 3,
      category: 'manager',
      question: 'How do I create a team and assign a team leader?',
      answer: 'After uploading interns, go to Team Management > Create Team. Select your project, name your team, add members, and select a team leader from the intern list. The team leader will get form access for daily reporting.',
      helpful: 189
    },
    {
      id: 4,
      category: 'team-leader',
      question: 'How do I submit daily work reports?',
      answer: 'Log in to your limited-access form. Select the project, date, team member, enter work description, status, and any remarks. Submit to record the entry. You can submit for multiple members on the same date.',
      helpful: 267
    },
    {
      id: 5,
      category: 'projects',
      question: 'How do I track project deadlines?',
      answer: 'Admins and managers can view all projects with deadlines in the dashboard. Click on any project to expand and see team details, leader information, and date-wise task reports.',
      helpful: 145
    },
    {
      id: 6,
      category: 'admin',
      question: 'What reports can I view as Admin?',
      answer: 'Admins can view all projects, deadlines, team structures, and date-wise task reports. Expand any project to see team names, team leaders, and member-wise work logs.',
      helpful: 123
    },
    {
      id: 7,
      category: 'manager',
      question: 'What happens if an intern is inactive?',
      answer: 'You can mark interns as Inactive in the system. They will be disabled but their data remains saved. Inactive interns cannot be assigned to teams or tasks.',
      helpful: 98
    },
    {
      id: 8,
      category: 'team-leader',
      question: 'Can I edit submitted reports?',
      answer: 'Yes, you can edit reports for the current day. For previous dates, contact your manager for corrections.',
      helpful: 112
    }
  ];

  // Help guides
  const guides = [
    {
      title: 'Admin Quick Start',
      description: 'Set up managers and monitor the system',
      icon: '👑',
      color: 'from-blue-500 to-blue-600',
      time: '5 min read'
    },
    {
      title: 'Manager Guide',
      description: 'Create projects, upload interns, form teams',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
      time: '10 min read'
    },
    {
      title: 'Team Leader Manual',
      description: 'Submit daily work reports',
      icon: '👥',
      color: 'from-blue-500 to-purple-500',
      time: '8 min read'
    },
    {
      title: 'CSV Upload Tutorial',
      description: 'Bulk intern onboarding guide',
      icon: '📁',
      color: 'from-blue-500 to-green-500',
      time: '6 min read'
    }
  ];

  // Support options
  const supportOptions = [
    {
      icon: <HiOutlineMail className="text-3xl" />,
      title: 'Email Support',
      description: 'Get help within 24 hours',
      action: 'Send Email',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <HiOutlineChat className="text-3xl" />,
      title: 'Live Chat',
      description: 'Chat with our team',
      action: 'Start Chat',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <HiOutlinePhone className="text-3xl" />,
      title: 'Phone Support',
      description: 'Business hours only',
      action: 'Request Call',
      color: 'from-blue-500 to-green-500'
    },
    {
      icon: <HiOutlineDocumentText className="text-3xl" />,
      title: 'Documentation',
      description: 'Detailed system guides',
      action: 'Read Docs',
      color: 'from-blue-500 to-orange-500'
    }
  ];

  // Popular searches
  const popularSearches = [
    'upload interns', 'create team', 'assign leader', 'daily report', 'deadline', 'CSV format'
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HiOutlineQuestionMarkCircle className="text-lg" />
            <span>Help Center</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              How Can We Help?
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-8">
            Search for guides on managing projects, uploading interns, submitting reports, and more.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none text-lg"
            />
          </div>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-500 mr-2">Popular:</span>
            {popularSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(term)}
                className="text-sm bg-white border border-blue-200 text-gray-600 px-3 py-1 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Guides */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${guide.color} flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
                    {guide.icon}
                  </div>
                  <span className="text-xs text-gray-400">{guide.time}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{guide.title}</h3>
                <p className="text-sm text-gray-500">{guide.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Frequently Asked
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Questions</span>
            </h2>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-blue-100 rounded-xl overflow-hidden hover:border-blue-300 transition-all"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-blue-50 transition-all"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <span className={`transform transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                    <p className="text-gray-600 mb-3">{faq.answer}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Was this helpful?</span>
                      <div className="flex items-center gap-2">
                        <button className="text-green-600 hover:bg-green-100 px-3 py-1 rounded-lg transition-all">
                          👍 Yes ({faq.helpful})
                        </button>
                        <button className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg transition-all">
                          👎 No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Still Need
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Help?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-center group">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{option.description}</p>
                <button className="text-blue-600 font-medium hover:text-blue-800 transition-all">
                  {option.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="py-12 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Video Tutorials
            </h2>
            <p className="text-white/90 text-lg">
              Watch step-by-step guides for common tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Bulk Intern Upload', time: '3:45' },
              { title: 'Creating Teams & Leaders', time: '4:30' },
              { title: 'Submitting Daily Reports', time: '2:15' }
            ].map((video, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all cursor-pointer group">
                <div className="relative h-40 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiOutlinePlay className="text-3xl text-blue-600 ml-1" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white mb-1">{video.title}</h3>
                  <p className="text-white/70 text-sm">{video.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
