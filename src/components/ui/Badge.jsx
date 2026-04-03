/**
 * Badge — status indicator pill
 *
 * status values:
 *   'graded' | 'pending' | 'late' | 'active' | 'submitted' | 'not-submitted' | 'inactive'
 */
const STATUS_MAP = {
  graded:        { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Graded' },
  pending:       { bg: 'bg-yellow-100',  text: 'text-yellow-700',  dot: 'bg-yellow-500',  label: 'Pending' },
  late:          { bg: 'bg-red-100',     text: 'text-red-600',     dot: 'bg-red-500',     label: 'Late' },
  active:        { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500',    label: 'Active' },
  submitted:     { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500',  label: 'Submitted' },
  'not-submitted': { bg: 'bg-slate-100', text: 'text-slate-500',   dot: 'bg-slate-400',   label: 'Not Submitted' },
  inactive:      { bg: 'bg-slate-100',   text: 'text-slate-500',   dot: 'bg-slate-400',   label: 'Inactive' },
  closed:        { bg: 'bg-red-50',      text: 'text-red-500',     dot: 'bg-red-400',     label: 'Closed' },
}

export default function Badge({ status, showDot = false, className = '' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      )}
      {s.label}
    </span>
  )
}
