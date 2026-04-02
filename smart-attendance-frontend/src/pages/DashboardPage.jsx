import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { attendanceService } from '../services/attendanceService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await attendanceService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center max-w-md">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
          <p className="text-red-400 text-xs mt-2">Make sure the backend is running on port 8080</p>
          <button
            onClick={() => { setLoading(true); setError(null); loadStats(); }}
            className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-xl">
          <p className="text-xs text-gray-400 font-semibold mb-1">{label}</p>
          <p className="text-sm font-bold text-emerald-500">Present: {payload[0]?.value}</p>
          <p className="text-sm font-bold text-rose-500">Absent: {payload[1]?.value}</p>
        </div>
      );
    }
    return null;
  };

  const presentRate = stats?.totalStudents
    ? Math.round((stats.presentToday / stats.totalStudents) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} color="blue" />
        <StatCard title="Present Today" value={stats?.presentToday || 0} icon={UserCheck} color="green" trend={5.2} />
        <StatCard title="Absent Today" value={stats?.absentToday || 0} icon={UserX} color="red" trend={-2.1} />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.overallAttendancePercentage || 0}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Attendance Trend (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absentGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.slice(5)}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#presentGradLight)" strokeWidth={3} />
                <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#absentGradLight)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Overview</h3>
          <div className="space-y-5">
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Attendance Rate</span>
                <span className="text-sm font-bold text-emerald-600">{stats?.overallAttendancePercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-green-500 h-2.5 rounded-full transition-all duration-1000 shadow-sm shadow-emerald-200"
                  style={{ width: `${stats?.overallAttendancePercentage || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600">Present Rate Today</span>
                <span className="text-sm font-bold text-indigo-600">{presentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2.5 rounded-full transition-all duration-1000 shadow-sm shadow-indigo-200"
                  style={{ width: `${presentRate}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                <p className="text-3xl font-extrabold text-emerald-600">{stats?.presentToday || 0}</p>
                <p className="text-xs font-semibold text-emerald-700/70 mt-1 uppercase tracking-wider">Present</p>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                <p className="text-3xl font-extrabold text-rose-600">{stats?.absentToday || 0}</p>
                <p className="text-xs font-semibold text-rose-700/70 mt-1 uppercase tracking-wider">Absent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
