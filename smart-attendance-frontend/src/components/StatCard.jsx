const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const styles = {
    blue: { bg: 'bg-blue-50', icon: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', icon: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-100', text: 'text-emerald-600' },
    red: { bg: 'bg-rose-50', icon: 'from-rose-500 to-red-600', shadow: 'shadow-rose-100', text: 'text-rose-600' },
    purple: { bg: 'bg-violet-50', icon: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-100', text: 'text-violet-600' },
  };

  const s = styles[color] || styles.blue;

  return (
    <div className="hover-lift bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          {trend !== undefined && (
            <p className={`text-xs mt-1.5 font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${s.icon} shadow-lg ${s.shadow}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
