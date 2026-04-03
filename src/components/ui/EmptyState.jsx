import Button from './Button.jsx'

/**
 * EmptyState — friendly empty list placeholder
 *
 * @prop {string}   icon     - emoji
 * @prop {string}   title
 * @prop {string}   message
 * @prop {string}   actionLabel  - CTA button label
 * @prop {function} onAction     - CTA handler
 */
export default function EmptyState({ icon = '📭', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      {title && (
        <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
      )}
      {message && (
        <p className="text-sm text-slate-400 max-w-sm">{message}</p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  )
}
