const colorMap = {
  indigo: {
    icon: 'bg-indigo-500/20 text-indigo-400',
    ring: 'ring-indigo-500/20',
  },
  emerald: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  amber: {
    icon: 'bg-amber-500/20 text-amber-400',
    ring: 'ring-amber-500/20',
  },
  red: {
    icon: 'bg-red-500/20 text-red-400',
    ring: 'ring-red-500/20',
  },
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo' }) => {
  const c = colorMap[color];
  const trendColor =
    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400';
  const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className={`relative bg-slate-800 rounded-xl p-6 ring-1 ${c.ring} overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-100 tracking-tight">{value}</p>
          {trendValue && (
            <p className={`mt-1 text-sm font-medium ${trendColor}`}>
              {trendSymbol} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`flex-shrink-0 p-3 rounded-lg ${c.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-10" />
    </div>
  );
};

export default StatCard;
