import { useRef } from 'react'
import { Upload, File, X } from 'lucide-react'

/**
 * FileUpload — drag-and-drop file picker
 *
 * @prop {File|null}  file       - currently selected file
 * @prop {function}   onChange   - receives File object
 * @prop {string}     accept     - accepted MIME types
 * @prop {string}     hint       - helper text
 * @prop {string}     error
 */
export default function FileUpload({
  file,
  onChange,
  accept = '.pdf,.zip,.docx,.py,.cpp,.java,.sql',
  hint = 'PDF, ZIP, DOCX, PY, CPP, JAVA, SQL supported',
  error,
}) {
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) onChange(dropped)
  }

  const handleDragOver = (e) => e.preventDefault()

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />

      {file ? (
        /* File selected state */
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <File size={18} className="text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-emerald-800 truncate">{file.name}</div>
            <div className="text-xs text-emerald-600">{formatSize(file.size)}</div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1 rounded-lg text-emerald-500 hover:bg-emerald-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Empty drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed
            cursor-pointer transition-all duration-200
            hover:border-blue-400 hover:bg-blue-50
            ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}
          `}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Upload size={20} className="text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">
              Click to upload{' '}
              <span className="text-blue-600">or drag & drop</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  )
}
