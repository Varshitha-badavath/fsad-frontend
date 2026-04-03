/**
 * StatCard — dashboard metric card
 *
 * @prop {string|ReactNode} icon     - emoji or icon component
 * @prop {string}           label    - metric label
 * @prop {string|number}    value    - metric value
 * @prop {string}           color    - hex color for icon background tint
 * @prop {string}           trend    - optional trend text e.g. "+2 this week"
 * @prop {boolean}          trendUp  - green if true, red if false, neutral if undefined
 */
export default function StatCard({ icon, label, value, color = '#3b82f6', trend, trendUp }) {
  const trendColor =
    trendUp === undefined
      ? 'text-slate-400'
      : trendUp
      ? 'text-emerald-600'
      : 'text-red-500'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 animate-fade-up hover:shadow-card-hover transition-shadow duration-300">
      <div className="flex items-center gap-4">
        {/* Icon bubble */}
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{
            width: 52,
            height: 52,
            background: color + '18',
            boxShadow: `0 0 0 1px ${color}20`,
          }}
        >
          {icon}
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="text-3xl font-bold text-slate-900 leading-none">{value}</div>
          <div className="text-sm text-slate-500 mt-1 truncate">{label}</div>
          {trend && (
            <div className={`text-xs font-medium mt-1 ${trendColor}`}>{trend}</div>
          )}
        </div>
      </div>
    </div>
  )
}
