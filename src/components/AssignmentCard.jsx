import Badge  from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import { formatDate, isOverdue, dueDateLabel } from '../utils/helpers.js'
import { Calendar, Hash, BookOpen, AlertTriangle } from 'lucide-react'

/**
 * AssignmentCard — displays a single assignment in the teacher view
 *
 * @prop {object}   assignment
 * @prop {number}   submissionCount
 * @prop {function} onViewSubmissions
 */
export default function AssignmentCard({ assignment, submissionCount = 0, onViewSubmissions }) {
  const overdue = isOverdue(assignment.dueDate) && assignment.status !== 'graded'
  const dueLabel = dueDateLabel(assignment.dueDate)

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300 p-5 flex flex-col gap-4 animate-fade-up">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 tracking-wide">{assignment.subject}</span>
            <Badge status={assignment.status} />
            {overdue && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                <AlertTriangle size={10} />Overdue
              </span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2">
            {assignment.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
        {assignment.description}
      </p>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(assignment.dueDate)}
        </span>
        <span className="flex items-center gap-1">
          <Hash size={12} />
          {assignment.totalMarks} marks
        </span>
        <span className="flex items-center gap-1">
          <BookOpen size={12} />
          {submissionCount} submission{submissionCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Due date chip */}
      <div className={`text-xs font-medium px-2.5 py-1 rounded-lg w-fit
        ${overdue ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
        {dueLabel}
      </div>

      {/* Action */}
      <div className="pt-1 border-t border-slate-50">
        <Button
          variant="outline"
          onClick={() => onViewSubmissions(assignment)}
          className="w-full justify-center"
          size="sm"
        >
          📋 View Submissions ({submissionCount})
        </Button>
      </div>
    </div>
  )
}
