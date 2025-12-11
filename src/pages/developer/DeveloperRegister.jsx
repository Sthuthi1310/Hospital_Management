import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Code } from 'lucide-react';
import { validatePassword, validateRequired, validateUsername } from '../../utils/validation';

const DeveloperRegister = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalLocation: '',
    hospitalLogo: '',
    adminUsername: '',
    adminPassword: '',
    confirmPassword: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.hospitalName)) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!validateRequired(formData.hospitalLocation)) {
      newErrors.hospitalLocation = 'Hospital location is required';
    }

    const usernameValidation = validateUsername(formData.adminUsername);
    if (!usernameValidation.valid) {
      newErrors.adminUsername = usernameValidation.message;
    }

    const passwordValidation = validatePassword(formData.adminPassword);
    if (!passwordValidation.valid) {
      newErrors.adminPassword = passwordValidation.message;
    }

    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');

      if (storedAdmins.some((a) => a.username === formData.adminUsername)) {
        setErrors({ adminUsername: 'Username already exists' });
        return;
      }

      const newAdmin = {
        username: formData.adminUsername,
        password: formData.adminPassword,
        hospitalName: formData.hospitalName,
        hospitalLocation: formData.hospitalLocation,
        hospitalLogo: formData.hospitalLogo,
        departments: []
      };

      storedAdmins.push(newAdmin);
      localStorage.setItem('admins', JSON.stringify(storedAdmins));

      setSuccessMessage(`Admin registered successfully! Username: ${formData.adminUsername}`);
      setFormData({
        hospitalName: '',
        hospitalLocation: '',
        hospitalLogo: '',
        adminUsername: '',
        adminPassword: '',
        confirmPassword: ''
      });
      setErrors({});

      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00235B] via-[#0066B2] to-[#00A8E8] py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center text-white hover:text-[#A0E7FF] transition-colors duration-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#40C9FF] to-[#A0E7FF] p-8 text-center">
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
              <Code className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Developer Portal</h1>
            <p className="text-white/80 mt-2">Register Hospital Administrators</p>
          </div>

          <div className="p-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-[#00235B] mb-4">Hospital Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all ${
                        errors.hospitalName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter hospital name"
                    />
                    {errors.hospitalName && <p className="mt-1 text-sm text-red-600">{errors.hospitalName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Location *
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalLocation}
                      onChange={(e) => setFormData({ ...formData, hospitalLocation: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all ${
                        errors.hospitalLocation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter hospital location"
                    />
                    {errors.hospitalLocation && <p className="mt-1 text-sm text-red-600">{errors.hospitalLocation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Logo URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalLogo}
                      onChange={(e) => setFormData({ ...formData, hospitalLogo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all"
                      placeholder="Enter logo URL"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#00235B] mb-4">Admin Credentials</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Username *
                    </label>
                    <input
                      type="text"
                      value={formData.adminUsername}
                      onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all ${
                        errors.adminUsername ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Choose admin username"
                    />
                    {errors.adminUsername && <p className="mt-1 text-sm text-red-600">{errors.adminUsername}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all ${
                          errors.adminPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Create admin password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.adminPassword && <p className="mt-1 text-sm text-red-600">{errors.adminPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#40C9FF] focus:border-transparent transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm admin password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#40C9FF] to-[#A0E7FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register Admin
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This portal is for developers only. Registered admins can log in through the Admin portal on the main page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperRegister;

