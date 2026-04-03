import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

/**
 * FormInput — labelled input with error display and password toggle
 *
 * @prop {string}   label
 * @prop {string}   type       - 'text' | 'email' | 'password' | 'number' | 'date'
 * @prop {string}   value
 * @prop {function} onChange
 * @prop {string}   placeholder
 * @prop {string}   error
 * @prop {boolean}  required
 * @prop {boolean}  disabled
 * @prop {string}   hint       - small hint text below input
 * @prop {string}   className
 */
export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  hint,
  className = '',
  ...rest
}) {
  const [showPass, setShowPass] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPass ? 'text' : 'password') : type

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 bg-slate-50
            placeholder:text-slate-400 outline-none transition-all duration-200
            focus:bg-white focus:ring-2
            disabled:opacity-60 disabled:cursor-not-allowed
            ${isPassword ? 'pr-11' : ''}
            ${error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : 'border-slate-200 focus:border-blue-400 focus:ring-blue-100'
            }
          `}
          {...rest}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {/* Hint text */}
      {hint && !error && (
        <p className="text-xs text-slate-400 mt-1.5">{hint}</p>
      )}

      {/* Error text */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  )
}
