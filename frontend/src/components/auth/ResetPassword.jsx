import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Key,
  Check,
  XCircle
} from 'lucide-react';
import { changePassword } from '../../api/index';
import { requestHandler } from '../../utils/index';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [token, setToken] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setStatus({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new password reset link.'
      });
    }
  }, [searchParams]);

  // Password strength calculation
  useEffect(() => {
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword)
    };
    setPasswordChecks(checks);

    let strength = 0;
    if (checks.length) strength++;
    if (checks.uppercase && checks.lowercase) strength++;
    if (checks.number) strength++;
    if (checks.special) strength++;
    setPasswordStrength(strength);
  }, [newPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match' });
      return false;
    }

    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: '', message: '' });

    if (!token) {
      setStatus({
        type: 'error',
        message: 'Invalid reset token. Please request a new password reset link.'
      });
      return;
    }

    if (!validatePassword()) {
      return;
    }

    await requestHandler(
      async () => {
        const response = await changePassword({
          token: token,
          newPassword: newPassword
        });
        return response;
      },
      setIsLoading,
      (data) => {
        setStatus({
          type: 'success',
          message: data?.message || 'Password changed successfully! Redirecting to login...'
        });

        // Redirect to login page immediately after success
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500); // Small delay to show success message
      },
      (error) => {
        setStatus({
          type: 'error',
          message: error?.message || 'Failed to change password. Please try again.'
        });
      }
    );
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Auto redirect if token is missing
  useEffect(() => {
    if (!token && status.type === 'error') {
      const redirectTimer = setTimeout(() => {
        navigate('/forgot-password');
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [token, status.type, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <a
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
          Back to Login
        </a>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <Key className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Create New Password</h1>
            <p className="text-blue-100 text-center text-sm">
              Your new password must be different from previously used passwords.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Status Messages */}
            {status.message && (
              <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                status.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800 animate-in fade-in slide-in-from-top-2 duration-300'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {status.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{status.message}</p>
                  {status.type === 'success' && (
                    <div className="mt-2">
                      <div className="w-full bg-green-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-green-600 h-1.5 rounded-full animate-[progress_1.5s_linear]"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    name="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading || !token}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        />
                      </div>
                      <span className="ml-3 text-xs font-medium text-gray-600">
                        {getPasswordStrengthText()}
                      </span>
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        {passwordChecks.length ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={passwordChecks.length ? 'text-green-600' : 'text-gray-500'}>
                          Min. 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.uppercase && passwordChecks.lowercase ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={passwordChecks.uppercase && passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'}>
                          Upper & lowercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.number ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={passwordChecks.number ? 'text-green-600' : 'text-gray-500'}>
                          Contains number
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.special ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-300" />
                        )}
                        <span className={passwordChecks.special ? 'text-green-600' : 'text-gray-500'}>
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading || !token}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && newPassword && (
                  <p className="mt-2 text-xs text-green-500 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>

            {/* Additional Help Text */}
            {!token && status.type === 'error' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-red-600 mb-3">
                  {status.message}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Redirecting to forgot password page...
                </p>
                <a
                  href="/forgot-password"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Click here if not redirected
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your password will be encrypted and securely stored.
          </p>
        </div>
      </div>

      {/* Add CSS animation for progress bar */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
