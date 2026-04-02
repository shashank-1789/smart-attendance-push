import { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Loader2, Filter } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentModal from '../components/StudentModal';
import toast from 'react-hot-toast';

const BRANCHES = ['All', 'CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];
const YEARS = ['All', 1, 2, 3, 4];

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    loadStudents();
  }, [selectedYear, selectedBranch]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const year = selectedYear !== 'All' ? selectedYear : '';
      const branch = selectedBranch !== 'All' ? selectedBranch : '';
      const data = await studentService.getAll('', year, branch);
      setStudents(data);
    } catch (err) {
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (data) => {
    try {
      const newStudent = await studentService.create(data);
      setStudents([...students, newStudent]);
      toast.success('Student added successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors
        ? Object.values(err.response.data.errors).join(', ')
        : 'Failed to add student';
      toast.error(msg);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentService.delete(id);
      setStudents(students.filter((s) => s.id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      s.branch?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const getYearLabel = (year) => {
    if (year === 1) return '1st';
    if (year === 2) return '2nd';
    if (year === 3) return '3rd';
    return '4th';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">{students.length} students enrolled</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl hover:from-indigo-600 hover:to-violet-700 transition-all font-semibold shadow-lg shadow-indigo-200 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by name, roll no, branch..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm shadow-sm"
          />
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm shadow-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y === 'All' ? 'All Years' : `${getYearLabel(y)} Year`}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Filter */}
        <select
          value={selectedBranch}
          onChange={(e) => { setSelectedBranch(e.target.value); setCurrentPage(1); }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all text-sm shadow-sm"
        >
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Branches' : b}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Branch</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Year</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No students found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm border border-indigo-100">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">{student.name}</span>
                          <span className="text-xs font-medium text-gray-500 md:hidden">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold tracking-wide">
                        {student.rollNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                        {student.branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-bold border border-violet-100">
                        {getYearLabel(student.year)} Year
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm font-medium text-gray-500">
              Showing <span className="text-gray-900 font-bold">{(currentPage - 1) * studentsPerPage + 1}</span> to{' '}
              <span className="text-gray-900 font-bold">{Math.min(currentPage * studentsPerPage, filteredStudents.length)}</span> of{' '}
              <span className="text-gray-900 font-bold">{filteredStudents.length}</span>
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all shadow-sm ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <StudentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddStudent} />
    </div>
  );
};

export default StudentsPage;
