import { useState, useEffect } from 'react';
import { ClipboardCheck, Loader2, Check, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { studentService } from '../services/studentService';
import { attendanceService } from '../services/attendanceService';
import toast from 'react-hot-toast';

const BRANCHES = ['All', 'CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];
const YEARS = ['All', 1, 2, 3, 4];

const AttendancePage = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

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
      const initial = {};
      data.forEach((s) => (initial[s.id] = 'PRESENT'));
      setAttendance(initial);
    } catch (err) {
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'PRESENT' ? 'ABSENT' : 'PRESENT',
    }));
  };

  const markAllPresent = () => {
    const all = {};
    students.forEach((s) => (all[s.id] = 'PRESENT'));
    setAttendance(all);
  };

  const markAllAbsent = () => {
    const all = {};
    students.forEach((s) => (all[s.id] = 'ABSENT'));
    setAttendance(all);
  };

  const handleSubmit = async () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId: Number(studentId),
      status,
    }));

    setSubmitting(true);
    try {
      await attendanceService.mark(date, records);
      toast.success(`Attendance marked for ${date}`);
    } catch (err) {
      toast.error('Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'ABSENT').length;

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
          <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Record daily attendance for students</p>
        </div>
        <div className="relative group">
          <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 z-10" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm shadow-sm"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y === 'All' ? 'All Years' : `${getYearLabel(y)} Year`}
              </option>
            ))}
          </select>
        </div>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm shadow-sm"
        >
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Branches' : b}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="pl-3 pr-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <span className="text-sm text-emerald-700 font-bold">Present: {presentCount}</span>
        </div>
        <div className="pl-3 pr-4 py-1.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
            <X className="w-3 h-3" />
          </div>
          <span className="text-sm text-rose-700 font-bold">Absent: {absentCount}</span>
        </div>
        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>
        <button onClick={markAllPresent} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors text-sm">
          Mark All Present
        </button>
        <button onClick={markAllAbsent} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors text-sm">
          Mark All Absent
        </button>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 font-medium">
            No students found for the selected filters
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{student.name}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide">
                      {student.rollNumber} • {student.branch} • {getYearLabel(student.year)} Year
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleStatus(student.id)}
                  className={`w-[110px] py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                    attendance[student.id] === 'PRESENT'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {attendance[student.id] === 'PRESENT' ? (
                    <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4 stroke-[3]" /> Present</span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5"><X className="w-4 h-4 stroke-[3]" /> Absent</span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || students.length === 0}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl hover:from-indigo-600 hover:to-violet-700 transition-all font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <ClipboardCheck className="w-5 h-5" /> Submit Attendance
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
