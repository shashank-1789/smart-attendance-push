import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { attendanceService } from '../services/attendanceService';

const ReportsPage = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await attendanceService.getReport();
      setReport(data);
    } catch (err) {
      setError('Failed to load reports. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const getColor = (percentage) => {
    if (percentage >= 90) return '#10b981'; // emerald-500
    if (percentage >= 75) return '#3b82f6'; // blue-500
    if (percentage >= 60) return '#f59e0b'; // amber-500
    return '#ef4444'; // rose-500
  };

  const getBarColor = (percentage) => {
    if (percentage >= 90) return 'from-emerald-400 to-green-500';
    if (percentage >= 75) return 'from-blue-400 to-indigo-500';
    if (percentage >= 60) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  const getStatusBadge = (percentage) => {
    if (percentage >= 90) return { text: 'Excellent', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (percentage >= 75) return { text: 'Good', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (percentage >= 60) return { text: 'Average', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: 'Low', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xl">
          <p className="text-sm font-bold text-gray-900">{data.studentName}</p>
          <p className="text-xs font-semibold text-gray-500">{data.rollNumber}</p>
          <p className="text-sm mt-1 font-bold" style={{ color: getColor(data.attendancePercentage) }}>
            {data.attendancePercentage}% Attendance
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center max-w-md">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(null); loadReport(); }}
            className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Take top 15 for chart readability
  const chartData = report.slice(0, 15);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance Reports</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Detailed student-wise analysis — {report.length} students</p>
      </div>

      {/* Chart */}
      {report.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Attendance Distribution (Top 15)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="studentName"
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.split(' ')[0]}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="attendancePercentage" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.attendancePercentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {report.map((student) => {
          const badge = getStatusBadge(student.attendancePercentage);
          return (
            <div
              key={student.studentId}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover-lift animate-fade-in"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                    {student.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{student.studentName}</p>
                    <p className="text-xs font-semibold text-gray-500 tracking-wide">{student.rollNumber}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${badge.bg}`}>
                  {badge.text}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-gray-600">Rate</span>
                  <span className="font-bold" style={{ color: getColor(student.attendancePercentage) }}>
                    {student.attendancePercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(student.attendancePercentage)} transition-all duration-1000`}
                    style={{ width: `${student.attendancePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Box Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Total</p>
                  <p className="text-sm font-extrabold text-gray-900">{student.totalClasses}</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-700/70 uppercase tracking-widest mb-0.5">Present</p>
                  <p className="text-sm font-extrabold text-emerald-700">{student.presentCount}</p>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-100">
                  <p className="text-[10px] font-bold text-rose-700/70 uppercase tracking-widest mb-0.5">Absent</p>
                  <p className="text-sm font-extrabold text-rose-700">{student.absentCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPage;
