import { useState } from 'react';
import { X } from 'lucide-react';

const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];
const YEARS = [1, 2, 3, 4];

const StudentModal = ({ isOpen, onClose, onSubmit, student = null }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    rollNumber: student?.rollNumber || '',
    department: student?.department || '',
    year: student?.year || 1,
    branch: student?.branch || 'CSE',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.rollNumber.trim()) e.rollNumber = 'Roll number is required';
    if (!formData.department.trim()) e.department = 'Department is required';
    if (!formData.year) e.year = 'Year is required';
    if (!formData.branch) e.branch = 'Branch is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, year: Number(formData.year) });
      onClose();
    }
  };

  if (!isOpen) return null;

  const DEPT_MAP = {
    CSE: 'Computer Science & Engineering',
    ECE: 'Electronics & Communication',
    ME: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    EE: 'Electrical Engineering',
    IT: 'Information Technology',
  };

  const handleBranchChange = (branch) => {
    setFormData({
      ...formData,
      branch,
      department: DEPT_MAP[branch] || formData.department,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-md border border-gray-100 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {student ? 'Edit Student' : 'Add New Student'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Roll Number</label>
            <input
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="CSE1001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
            />
            {errors.rollNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.rollNumber}</p>}
          </div>

          {/* Year & Branch row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'} Year
                  </option>
                ))}
              </select>
              {errors.year && <p className="text-red-500 text-xs mt-1 font-medium">{errors.year}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => handleBranchChange(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.branch && <p className="text-red-500 text-xs mt-1 font-medium">{errors.branch}</p>}
            </div>
          </div>

          {/* Department (auto-filled from branch) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Computer Science & Engineering"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm"
            />
            {errors.department && <p className="text-red-500 text-xs mt-1 font-medium">{errors.department}</p>}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors font-semibold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl hover:from-indigo-600 hover:to-violet-700 transition-all font-semibold shadow-lg shadow-indigo-200 text-sm"
            >
              {student ? 'Update' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
