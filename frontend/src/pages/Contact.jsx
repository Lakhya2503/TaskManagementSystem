import React, { useState } from 'react';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineGlobe,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineChat,
  HiOutlinePaperAirplane,
} from "react-icons/hi";
import { MdOutlineMessage } from "react-icons/md";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    inquiryType: 'general'
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Contact methods
  const contactMethods = [
    {
      icon: <HiOutlineMail className="text-3xl" />,
      title: 'Email Us',
      value: 'support@taskmanagement.com',
      action: 'Send Email',
      color: 'from-blue-500 to-blue-600',
      response: 'Within 24 hours'
    },
    {
      icon: <HiOutlineChat className="text-3xl" />,
      title: 'Live Chat',
      value: 'Available 24/7',
      action: 'Start Chat',
      color: 'from-blue-500 to-purple-500',
      response: 'Instant'
    },
    {
      icon: <HiOutlinePhone className="text-3xl" />,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      action: 'Request Call',
      color: 'from-blue-500 to-green-500',
      response: 'Business hours'
    },
    {
      icon: <HiOutlineLocationMarker className="text-3xl" />,
      title: 'Visit Us',
      value: 'San Francisco, CA',
      action: 'Get Directions',
      color: 'from-blue-500 to-orange-500',
      response: 'By appointment'
    }
  ];

  // Office locations
  const offices = [
    {
      city: 'San Francisco (HQ)',
      address: '123 Market Street, Suite 400',
      region: 'San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@taskmanagement.com',
      hours: 'Mon-Fri, 9am-6pm PT',
      icon: '🌉'
    },
    {
      city: 'New York',
      address: '456 Broadway, Floor 12',
      region: 'New York, NY 10013',
      phone: '+1 (555) 987-6543',
      email: 'nyc@taskmanagement.com',
      hours: 'Mon-Fri, 9am-6pm ET',
      icon: '🗽'
    },
    {
      city: 'London',
      address: '78 Oxford Street',
      region: 'London, W1D 1BS, UK',
      phone: '+44 20 1234 5678',
      email: 'london@taskmanagement.com',
      hours: 'Mon-Fri, 9am-6pm GMT',
      icon: '🇬🇧'
    },
    {
      city: 'Singapore',
      address: '12 Marina Boulevard',
      region: 'Singapore 018982',
      phone: '+65 1234 5678',
      email: 'singapore@taskmanagement.com',
      hours: 'Mon-Fri, 9am-6pm SGT',
      icon: '🇸🇬'
    }
  ];

  // Inquiry types
  const inquiryTypes = [
    'General Inquiry',
    'Sales & Pricing',
    'Technical Support',
    'Implementation Help',
    'Bulk Upload Assistance',
    'Partnership Opportunities'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
    setFormData({
      name: '',
      email: '',
      company: '',
      role: '',
      message: '',
      inquiryType: 'general'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HiOutlineMail className="text-lg" />
            <span>Get in Touch</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-gray-900">
              Contact Our
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {' '}Team
            </span>
          </h1>

          <p className="text-xl text-gray-500 mb-8">
            Have questions about implementation, pricing, or need help with your task management system? We're here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-center group">
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {method.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{method.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{method.value}</p>
                <p className="text-xs text-blue-600 mb-3">⏱️ {method.response}</p>
                <button className="text-blue-600 font-medium hover:text-blue-800 transition-all">
                  {method.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-black mb-6">
                Send us a
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="team-leader">Team Leader</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type *
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  >
                    {inquiryTypes.map((type, index) => (
                      <option key={index} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  Send Message <HiOutlinePaperAirplane className="text-xl" />
                </button>
              </form>
            </div>

            {/* Support Info */}
            <div>
              <h2 className="text-3xl font-black mb-6">
                Support
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Information</span>
              </h2>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-4">Implementation Support</h3>
                <p className="text-white/90 mb-6">
                  Need help setting up your task management system? Our team provides:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="text-xl" />
                    <span>CSV/Excel template guidance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="text-xl" />
                    <span>Team structure setup</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="text-xl" />
                    <span>Role configuration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <HiOutlineCheckCircle className="text-xl" />
                    <span>Training for managers</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="font-bold text-gray-800 mb-4">Quick Response Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email support</span>
                    <span className="font-medium text-blue-600">&lt; 24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Live chat</span>
                    <span className="font-medium text-blue-600">&lt; 5 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phone support</span>
                    <span className="font-medium text-blue-600">Immediate (business hours)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Implementation queries</span>
                    <span className="font-medium text-blue-600">&lt; 12 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-12 px-6 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Our
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Offices</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Visit us at any of our global locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="text-4xl mb-3">{office.icon}</div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{office.city}</h3>
                <p className="text-sm text-gray-600 mb-3">{office.address}</p>
                <p className="text-sm text-gray-500 mb-2">{office.region}</p>
                <div className="text-sm text-blue-600 mb-1">{office.phone}</div>
                <div className="text-sm text-blue-600 mb-2">{office.email}</div>
                <div className="text-xs text-gray-400">{office.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Support */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
            <HiOutlineGlobe className="text-6xl mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Global Support Team</h3>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Our support team is available across time zones to help with your task management needs.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <div className="font-bold">30+ Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🕒</div>
                <div className="font-bold">24/7 Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">👥</div>
                <div className="font-bold">8 Languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-up z-50">
          <div className="flex items-center gap-3">
            <HiOutlineCheckCircle className="text-2xl" />
            <span className="font-medium">Message sent! We'll respond within 24 hours.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
