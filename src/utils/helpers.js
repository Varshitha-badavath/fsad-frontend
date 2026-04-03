// ─── Date Helpers ─────────────────────────────────────────────────────────────

/**
 * Formats a date string to readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} - e.g. "Mar 15, 2025"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Returns true if the given date is in the past
 */
export const isOverdue = (dueDateStr) => {
  return new Date(dueDateStr) < new Date()
}

/**
 * Returns days remaining until due date (negative if overdue)
 */
export const daysUntilDue = (dueDateStr) => {
  const diff = new Date(dueDateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Returns a human-readable due status label
 */
export const dueDateLabel = (dueDateStr) => {
  const days = daysUntilDue(dueDateStr)
  if (days < 0)  return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Due today!'
  if (days === 1) return 'Due tomorrow'
  return `${days} days left`
}

// ─── Validation Helpers ───────────────────────────────────────────────────────

export const validators = {
  required: (value) => (!value || !String(value).trim() ? 'This field is required' : null),
  email:    (value) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : null),
  minLength: (min) => (value) =>
    value && value.length < min ? `Must be at least ${min} characters` : null,
  match: (other, label = 'Passwords') => (value) =>
    value !== other ? `${label} do not match` : null,
  numeric: (value) => (isNaN(value) || value === '' ? 'Must be a number' : null),
  range: (min, max) => (value) =>
    Number(value) < min || Number(value) > max ? `Must be between ${min} and ${max}` : null,
}

/**
 * Runs a set of validation rules against a form object
 * @param {object} form   - { fieldName: value }
 * @param {object} rules  - { fieldName: [validatorFn, ...] }
 * @returns {object}      - { fieldName: errorMessage | null }
 */
export const validateForm = (form, rules) => {
  const errors = {}
  for (const [field, fns] of Object.entries(rules)) {
    for (const fn of fns) {
      const err = fn(form[field])
      if (err) { errors[field] = err; break }
    }
  }
  return errors
}

// ─── Misc Helpers ─────────────────────────────────────────────────────────────

/**
 * Returns initials from a full name
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

/**
 * Truncates a string to maxLen characters
 */
export const truncate = (str, maxLen = 80) =>
  str && str.length > maxLen ? str.slice(0, maxLen) + '…' : str

/**
 * Returns a percentage string
 */
export const percent = (value, total) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : '0%'
