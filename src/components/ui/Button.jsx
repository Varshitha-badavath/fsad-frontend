import { Loader2 } from 'lucide-react'

/**
 * Reusable Button component
 *
 * @prop {string}   variant    - 'primary' | 'emerald' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * @prop {boolean}  loading    - shows spinner and disables
 * @prop {boolean}  disabled
 * @prop {string}   size       - 'sm' | 'md' | 'lg'
 * @prop {string}   type       - HTML button type
 * @prop {function} onClick
 * @prop {string}   className  - extra Tailwind classes
 */
export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  size = 'md',
  type = 'button',
  onClick,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl border-none cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed select-none'

  const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variants = {
    primary:
      'bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-sm hover:shadow-md',
    emerald:
      'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md',
    secondary:
      'bg-slate-100 text-slate-600 hover:bg-slate-200',
    outline:
      'bg-transparent text-blue-600 border border-blue-500 hover:bg-blue-50',
    'outline-emerald':
      'bg-transparent text-emerald-600 border border-emerald-500 hover:bg-emerald-50',
    danger:
      'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    success:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100',
    ghost:
      'bg-transparent text-slate-500 hover:bg-slate-100',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
