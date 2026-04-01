import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiEdit2, FiSave, FiX, FiCamera,
  FiLock, FiLoader, FiAlertCircle, FiCheckCircle, FiPhone,
  FiEye, FiEyeOff, FiRefreshCw, FiGlobe, FiAlignLeft
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { requestHandler } from '../../utils/index';
import { changeCurrentPassword, updateUserProfile, updateUserAvatar } from '../../api/index';

const Profile = ({ role = 'member' }) => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const fileInputRef = useRef(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        domain: user?.domain || '',
        bio: user?.bio || ''
      });
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const refreshPage = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        else if (value.length > 50) error = 'Name must be less than 50 characters';
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) error = 'Email is required';
        else if (!emailRegex.test(value)) error = 'Please enter a valid email address';
        break;

      case 'phone':
        if (value && !/^[+]?[\d\s-]{10,}$/.test(value.replace(/\s/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;

      case 'domain':
        if (value && value.length > 100) error = 'Domain must be less than 100 characters';
        break;

      case 'bio':
        if (value && value.length > 500) error = 'Bio must be less than 500 characters';
        break;

      default:
        break;
    }

    return error;
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleFieldBlur = (name) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFieldErrors(errors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const errors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (passwordData.newPassword && passwordData.currentPassword &&
        passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    requestHandler(
      () => updateUserProfile(formData),
      setLoading,
      (response) => {
        const updatedUser = response?.data || response;
        setUser(updatedUser);
        setIsEditing(false);
        showToast('Profile updated successfully! ✨ Refreshing page...', 'success');
        setTimeout(() => refreshPage(), 1500);
      },
      (error) => {
        console.error("Failed to update profile:", error);
        showToast(error?.message || 'Failed to update profile', 'error');
      }
    );
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Please select a valid image file (JPEG, PNG, or WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const avatarFormData = new FormData();
    avatarFormData.append('avatar', file);

    setAvatarLoading(true);

    requestHandler(
      () => updateUserAvatar(avatarFormData),
      setAvatarLoading,
      (response) => {
        const updatedUser = response?.data || response;
        setUser(updatedUser);
        showToast('Avatar updated successfully! 📸 Refreshing page...', 'success');
        setTimeout(() => refreshPage(), 1500);
      },
      (error) => {
        console.error("Failed to update avatar:", error);
        showToast(error?.message || 'Failed to update avatar', 'error');
      }
    );
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      showToast('Please fix the password errors', 'error');
      return;
    }

    setLoading(true);

    requestHandler(
      () => changeCurrentPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }),
      setLoading,
      () => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
        showToast('Password changed successfully! 🔒 Refreshing page...', 'success');
        setTimeout(() => refreshPage(), 1500);
      },
      (error) => {
        console.error("Failed to change password:", error);
        showToast(error?.message || 'Failed to change password', 'error');
      }
    );
  };

  const getAvatarUrl = (u) => {
    const name = u?.name || 'User';
    if (u?.avatar) return u.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${role === 'leader' ? '6366F1' : '10B981'}&color=fff&size=150&bold=true`;
  };

  const inputBaseClass = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 transition-all duration-200 outline-none";
  const getFieldClass = (name) => `${inputBaseClass} ${fieldErrors[name] ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}`;
  const getPasswordFieldClass = (field) => `${inputBaseClass} ${passwordErrors[field] ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}`;

  const gradientColors = role === 'leader'
    ? 'from-indigo-500 via-purple-500 to-pink-500'
    : 'from-emerald-500 via-teal-500 to-cyan-500';

  const buttonColor = role === 'leader' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700';
  const roleBadge = role === 'leader' ? 'Team Leader' : 'Team Member';
  const roleBadgeColor = role === 'leader' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-10 right-10 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
          >
            {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            <span className="font-medium">{toast.message}</span>
            {refreshing && <FiRefreshCw className="animate-spin" />}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`h-28 bg-gradient-to-r ${gradientColors}`} />
        <div className="relative px-6 pb-6">
          <div className="absolute -top-30 left-6">
            <div className="relative">
              <img src={getAvatarUrl(user)} alt="" className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white object-cover" />
              <button onClick={() => fileInputRef.current?.click()} disabled={avatarLoading}
                className={`absolute bottom-0 right-0 p-1.5 ${buttonColor} rounded-full text-white shadow hover:opacity-90 transition-all`}>
                {avatarLoading ? <FiLoader className="w-3 h-3 animate-spin" /> : <FiCamera className="w-3 h-3" />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpdate} className="hidden" />
            </div>
          </div>
          <div className="mt-16 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input type="text" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 w-full" />
                  <input type="email" value={formData.email} onChange={(e) => handleFieldChange('email', e.target.value)}
                    className="text-gray-600 bg-gray-50 border rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 w-full" />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500 flex items-center gap-1 mt-1"><FiMail size={14} /> {user?.email}</p>
                  {user?.phone && <p className="text-gray-500 flex items-center gap-1 mt-0.5"><FiPhone size={14} /> {user.phone}</p>}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 ${roleBadgeColor} text-xs font-bold rounded-full`}>{roleBadge}</span>
                    {user?.domain && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">{user.domain}</span>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {!isEditing && !isChangingPassword && (
                <>
                  <button onClick={() => setIsEditing(true)} className={`flex items-center gap-2 px-4 py-2 ${buttonColor} text-white rounded-xl hover:opacity-90 transition-all text-sm font-medium`}>
                    <FiEdit2 size={14} /> Edit Profile
                  </button>
                  <button onClick={() => setIsChangingPassword(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium text-gray-700">
                    <FiLock size={14} /> Change Password
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Edit Mode */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Full Name <span className="text-red-500">*</span></label>
                    <FiUser className="absolute left-3.5 top-[42px] text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleFieldBlur('name')}
                      className={getFieldClass('name')}
                      placeholder="John Doe"
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={10} /> {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email Address <span className="text-red-500">*</span></label>
                    <FiMail className="absolute left-3.5 top-[42px] text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleFieldBlur('email')}
                      className={getFieldClass('email')}
                      placeholder="john@example.com"
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={10} /> {fieldErrors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Contact & Role</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Phone Number</label>
                    <FiPhone className="absolute left-3.5 top-[42px] text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      onBlur={() => handleFieldBlur('phone')}
                      className={getFieldClass('phone')}
                      placeholder="+1 234 567 8900"
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={10} /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Work Domain</label>
                    <FiGlobe className="absolute left-3.5 top-[42px] text-gray-400" />
                    <input
                      type="text"
                      value={formData.domain}
                      onChange={(e) => handleFieldChange('domain', e.target.value)}
                      onBlur={() => handleFieldBlur('domain')}
                      className={getFieldClass('domain')}
                      placeholder="Engineering, Marketing, etc."
                    />
                    {fieldErrors.domain && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <FiAlertCircle size={10} /> {fieldErrors.domain}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Professional Bio</label>
                <FiAlignLeft className="absolute left-3.5 top-[42px] text-gray-400" />
                <textarea
                  rows="4"
                  value={formData.bio}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  onBlur={() => handleFieldBlur('bio')}
                  className={`${getFieldClass('bio')} resize-none`}
                  placeholder="Tell us about your background..."
                  maxLength="500"
                />
                <div className="flex justify-between items-center mt-1">
                  {fieldErrors.bio && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={10} /> {fieldErrors.bio}
                    </p>
                  )}
                  <p className={`text-xs ml-auto ${formData.bio.length > 450 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || Object.values(fieldErrors).some(error => error)}
                  className={`flex-1 ${buttonColor} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFieldErrors({});
                    setTouchedFields({});
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      domain: user?.domain || '',
                      bio: user?.bio || ''
                    });
                  }}
                  className="px-8 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Password Change Mode */}
          {isChangingPassword && (
            <form onSubmit={handlePasswordChangeSubmit} className="mt-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Current Password <span className="text-red-500">*</span></label>
                <FiLock className="absolute left-3.5 top-[42px] text-gray-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={getPasswordFieldClass('currentPassword')}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-[42px] text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {passwordErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={10} /> {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">New Password <span className="text-red-500">*</span></label>
                  <FiLock className="absolute left-3.5 top-[42px] text-gray-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={getPasswordFieldClass('newPassword')}
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={10} /> {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Confirm New Password <span className="text-red-500">*</span></label>
                  <FiLock className="absolute left-3.5 top-[42px] text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={getPasswordFieldClass('confirmPassword')}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-[42px] text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <FiAlertCircle size={10} /> {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 ${buttonColor} text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50`}
                >
                  {loading ? <FiLoader className="animate-spin" /> : <FiLock />}
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                  className="px-8 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Read-Only Mode */}
          {!isEditing && !isChangingPassword && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {user?.bio || "No bio provided yet. Click edit to add one!"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-xs font-medium text-gray-400 uppercase">Email</p>
                    <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <FiCheckCircle size={10} /> Verified
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-xs font-medium text-gray-400 uppercase">Phone</p>
                    <p className="text-gray-900 font-medium">{user?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-600 uppercase mb-3">Account Security</h4>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-indigo-700 hover:underline"
                  >
                    Change Password <FiLock />
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase mb-1">Member Since</p>
                  <p className="text-sm font-bold text-gray-700">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Activity Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">Live Updates</span>
        </div>
        <div className="space-y-6">
          {user?.activities?.length > 0 ? (
            user.activities.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <div>
                  <p className="text-gray-700 font-medium">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(item.date).toDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <FiCheckCircle className="w-12 h-12 mx-auto opacity-30" />
              </div>
              <p className="text-gray-400">No recent actions recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
