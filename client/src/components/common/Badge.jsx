const variantMap = {
  success: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 ring-red-500/30',
  info: 'bg-indigo-500/15 text-indigo-400 ring-indigo-500/30',
  default: 'bg-slate-600/40 text-slate-300 ring-slate-500/30',
};

const Badge = ({ variant = 'default', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${variantMap[variant]}`}
  >
    {children}
  </span>
);

export default Badge;
