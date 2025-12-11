import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { validateRequired } from '../../utils/validation';

const AdminLogin = ({ onBack, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(loginData.username)) {
      newErrors.username = 'Username is required';
    }

    if (!validateRequired(loginData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
      const admin = storedAdmins.find(
        (a) => a.username === loginData.username && a.password === loginData.password
      );

      if (admin) {
        localStorage.setItem('currentAdmin', loginData.username);
        onLogin(loginData.username);
      } else {
        setErrors({ general: 'Invalid username or password. Try: admin1 / Admin@123' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00235B] via-[#0066B2] to-[#00A8E8] py-8 px-4">
      <div className="container mx-auto max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-[#A0E7FF] transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] p-8 text-center">
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-white/80 mt-2">Hospital administration portal</p>
          </div>

          <div className="p-8">
            {errors.general && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Login
              </button>

              <p className="text-center text-sm text-gray-600">
                Demo credentials: admin1 / Admin@123
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

