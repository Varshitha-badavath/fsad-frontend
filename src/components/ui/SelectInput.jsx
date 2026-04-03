import { AlertCircle } from 'lucide-react'

/**
 * SelectInput — styled <select> with label and error
 *
 * @prop {string}   label
 * @prop {string}   value
 * @prop {function} onChange
 * @prop {Array}    options   - [string] or [{ value, label }]
 * @prop {string}   placeholder
 * @prop {string}   error
 * @prop {boolean}  required
 */
export default function SelectInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 text-slate-800 outline-none
          focus:bg-white focus:ring-2 transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed
          ${error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
          }
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const val   = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={val} value={val}>{label}</option>
        })}
      </select>

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  )
}
