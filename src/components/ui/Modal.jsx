import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal — centered dialog with backdrop blur
 *
 * @prop {boolean}  open
 * @prop {function} onClose
 * @prop {string}   title
 * @prop {string}   subtitle
 * @prop {ReactNode} children
 * @prop {string}   size     - 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-2xl shadow-modal w-full ${maxWidths[size]} max-h-[92vh] flex flex-col animate-fade-up`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
