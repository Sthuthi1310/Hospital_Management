import { useState, useEffect } from 'react';
import {
  LogOut,
  User,
  Building2,
  TrendingUp,
  UserPlus,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { departments } from '../../utils/dummyData';
import { validatePassword, validateRequired, validateUsername } from '../../utils/validation';

const AdminDashboard = ({ username, onLogout }) => {
  const [adminData, setAdminData] = useState(null);
  const [activeView, setActiveView] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [expandedDept, setExpandedDept] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [doctorForm, setDoctorForm] = useState({
    username: '',
    name: '',
    department: '',
    password: '',
    confirmPassword: ''
  });

  const [availabilityForm, setAvailabilityForm] = useState({
    doctorUsername: '',
    day: '',
    timeSlot: ''
  });

  useEffect(() => {
    const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    const admin = storedAdmins.find((a) => a.username === username);

    if (admin) {
      setAdminData(admin);
    } else {
      const defaultAdmin = {
        username: username,
        hospitalName: 'City General Hospital',
        hospitalLogo: '',
        hospitalLocation: 'Downtown, Main Street',
        departments: departments.map((dept) => ({
          name: dept,
          totalPatients: Math.floor(Math.random() * 500) + 100,
          monthlyData: [
            { month: 'January', patients: Math.floor(Math.random() * 100) + 50 },
            { month: 'February', patients: Math.floor(Math.random() * 100) + 50 },
            { month: 'March', patients: Math.floor(Math.random() * 100) + 50 },
            { month: 'April', patients: Math.floor(Math.random() * 100) + 50 },
            { month: 'May', patients: Math.floor(Math.random() * 100) + 50 },
            { month: 'June', patients: Math.floor(Math.random() * 100) + 50 }
          ],
          weeklyData: [
            { week: 'Week 1', patients: Math.floor(Math.random() * 50) + 10 },
            { week: 'Week 2', patients: Math.floor(Math.random() * 50) + 10 },
            { week: 'Week 3', patients: Math.floor(Math.random() * 50) + 10 },
            { week: 'Week 4', patients: Math.floor(Math.random() * 50) + 10 }
          ]
        }))
      };
      setAdminData(defaultAdmin);
    }
  }, [username]);

  const validateDoctorForm = () => {
    const newErrors = {};

    const usernameValidation = validateUsername(doctorForm.username);
    if (!usernameValidation.valid) {
      newErrors.username = usernameValidation.message;
    }

    if (!validateRequired(doctorForm.name)) {
      newErrors.name = 'Doctor name is required';
    }

    if (!doctorForm.department) {
      newErrors.department = 'Department is required';
    }

    const passwordValidation = validatePassword(doctorForm.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (doctorForm.password !== doctorForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterDoctor = (e) => {
    e.preventDefault();
    if (validateDoctorForm()) {
      const storedDoctors = JSON.parse(localStorage.getItem('doctors') || '[]');

      if (storedDoctors.some((d) => d.username === doctorForm.username)) {
        setErrors({ username: 'Username already exists' });
        return;
      }

      const newDoctor = {
        username: doctorForm.username,
        name: doctorForm.name,
        department: doctorForm.department,
        hospital: adminData?.hospitalName || 'Unknown Hospital',
        password: doctorForm.password,
        appointments: [],
        treatmentHistory: []
      };

      storedDoctors.push(newDoctor);
      localStorage.setItem('doctors', JSON.stringify(storedDoctors));

      setDoctorForm({
        username: '',
        name: '',
        department: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      alert('Doctor registered successfully!');
    }
  };

  const handleSetAvailability = (e) => {
    e.preventDefault();

    if (!availabilityForm.doctorUsername || !availabilityForm.day || !availabilityForm.timeSlot) {
      alert('Please fill all fields');
      return;
    }

    alert(`Availability set for ${availabilityForm.doctorUsername} on ${availabilityForm.day} at ${availabilityForm.timeSlot}`);

    setAvailabilityForm({
      doctorUsername: '',
      day: '',
      timeSlot: ''
    });
  };

  const totalPatients = adminData?.departments.reduce((sum, dept) => sum + dept.totalPatients, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{adminData?.hospitalName || 'Hospital'}</h1>
                <p className="text-white/80">{adminData?.hospitalLocation}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'overview'
                ? 'bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveView('register')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'register'
                ? 'bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Register Doctor</span>
          </button>

          <button
            onClick={() => setActiveView('availability')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'availability'
                ? 'bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:shadow-md'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>Set Availability</span>
          </button>
        </div>

        {activeView === 'overview' && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Departments</p>
                    <p className="text-3xl font-bold text-[#00A8E8]">{adminData?.departments.length || 0}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#00A8E8] to-[#40C9FF] rounded-xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Total Patients</p>
                    <p className="text-3xl font-bold text-[#40C9FF]">{totalPatients}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#40C9FF] to-[#A0E7FF] rounded-xl">
                    <User className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 mb-1">Active Doctors</p>
                    <p className="text-3xl font-bold text-[#0066B2]">
                      {JSON.parse(localStorage.getItem('doctors') || '[]').length}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-[#0066B2] to-[#00A8E8] rounded-xl">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#00235B] mb-6">Department Statistics</h2>

              <div className="space-y-4">
                {adminData?.departments.map((dept) => (
                  <div key={dept.name} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDept(expandedDept === dept.name ? null : dept.name)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00A8E8] to-[#40C9FF] rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-[#00235B]">{dept.name}</h3>
                          <p className="text-sm text-gray-600">Total Patients: {dept.totalPatients}</p>
                        </div>
                      </div>
                      {expandedDept === dept.name ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    {expandedDept === dept.name && (
                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Monthly Statistics</h4>
                            <div className="space-y-2">
                              {dept.monthlyData.map((data) => (
                                <div key={data.month} className="flex items-center justify-between p-2 bg-white rounded">
                                  <span className="text-sm text-gray-600">{data.month}</span>
                                  <span className="font-semibold text-[#00A8E8]">{data.patients} patients</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Weekly Statistics</h4>
                            <div className="space-y-2">
                              {dept.weeklyData.map((data) => (
                                <div key={data.week} className="flex items-center justify-between p-2 bg-white rounded">
                                  <span className="text-sm text-gray-600">{data.week}</span>
                                  <span className="font-semibold text-[#40C9FF]">{data.patients} patients</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'register' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#00235B] mb-6">Register New Doctor</h2>

            <form onSubmit={handleRegisterDoctor} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={doctorForm.username}
                  onChange={(e) => setDoctorForm({ ...doctorForm, username: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Choose a username"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter doctor's full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={doctorForm.department}
                  onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create a password"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={doctorForm.confirmPassword}
                  onChange={(e) => setDoctorForm({ ...doctorForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Register Doctor
              </button>
            </form>
          </div>
        )}

        {activeView === 'availability' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#00235B] mb-6">Set Doctor Availability</h2>

            <form onSubmit={handleSetAvailability} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Username *
                </label>
                <input
                  type="text"
                  value={availabilityForm.doctorUsername}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, doctorUsername: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all"
                  placeholder="Enter doctor's username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day *
                </label>
                <select
                  value={availabilityForm.day}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, day: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all"
                >
                  <option value="">Select day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot *
                </label>
                <input
                  type="text"
                  value={availabilityForm.timeSlot}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, timeSlot: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent transition-all"
                  placeholder="e.g., 09:00 AM - 12:00 PM"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00A8E8] to-[#40C9FF] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Set Availability
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

