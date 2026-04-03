import { useState, useEffect, useRef, useCallback } from 'react'

// ── Random string generator ────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
const generateCaptchaText = (length = 6) =>
  Array.from({ length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')

// ── Draw CAPTCHA on canvas ─────────────────────────────────────────────────────
const drawCaptcha = (canvas, text) => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#f0f4ff')
  grad.addColorStop(1, '#e8f0fe')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Noise dots
  for (let i = 0; i < 80; i++) {
    ctx.beginPath()
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(99,102,241,${Math.random() * 0.3})`
    ctx.fill()
  }

  // Noise lines
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(Math.random() * W, Math.random() * H)
    ctx.lineTo(Math.random() * W, Math.random() * H)
    ctx.strokeStyle = `rgba(99,102,241,${Math.random() * 0.25})`
    ctx.lineWidth = 1
    ctx.stroke()
  }

  // Draw each character with random tilt & color
  const charW = W / (text.length + 1)
  text.split('').forEach((char, i) => {
    ctx.save()
    const x = charW * (i + 0.8) + charW * 0.1
    const y = H / 2 + 6
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.5)
    ctx.font = `bold ${22 + Math.floor(Math.random() * 6)}px monospace`
    ctx.fillStyle = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669'][
      Math.floor(Math.random() * 5)
    ]
    ctx.fillText(char, 0, 0)
    ctx.restore()
  })

  // Border
  ctx.strokeStyle = '#c7d2fe'
  ctx.lineWidth = 1.5
  ctx.strokeRect(0, 0, W, H)
}

// ── CaptchaBox Component ───────────────────────────────────────────────────────
export default function CaptchaBox({ onValidChange }) {
  const canvasRef = useRef(null)
  const [captchaText, setCaptchaText] = useState('')
  const [userInput, setUserInput]     = useState('')
  const [status, setStatus]           = useState('idle') // idle | success | error

  const refresh = useCallback(() => {
    const text = generateCaptchaText()
    setCaptchaText(text)
    setUserInput('')
    setStatus('idle')
    onValidChange(false)
    // Draw after state update
    setTimeout(() => drawCaptcha(canvasRef.current, text), 0)
  }, [onValidChange])

  useEffect(() => { refresh() }, [refresh])

  const handleChange = (e) => {
    const val = e.target.value
    setUserInput(val)
    if (val.length === captchaText.length) {
      if (val === captchaText) {
        setStatus('success')
        onValidChange(true)
      } else {
        setStatus('error')
        onValidChange(false)
      }
    } else {
      setStatus('idle')
      onValidChange(false)
    }
  }

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        CAPTCHA Verification <span className="text-red-500">*</span>
      </label>

      {/* Canvas + Refresh */}
      <div className="flex items-center gap-2 mb-2">
        <canvas
          ref={canvasRef}
          width={200}
          height={54}
          className="rounded-lg border border-slate-200 select-none"
          style={{ userSelect: 'none' }}
        />
        <button
          type="button"
          onClick={refresh}
          title="Refresh CAPTCHA"
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50
            text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {/* Refresh icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9
                 m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2
                 m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="Type the characters above"
          maxLength={captchaText.length}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono tracking-widest
            focus:outline-none focus:ring-2 transition-colors
            ${status === 'success'
              ? 'border-green-400 bg-green-50 focus:ring-green-200 text-green-700'
              : status === 'error'
              ? 'border-red-400 bg-red-50 focus:ring-red-200 text-red-700'
              : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'
            }`}
        />
        {/* Status icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
          {status === 'success' && '✅'}
          {status === 'error'   && '❌'}
        </span>
      </div>

      {/* Hint messages */}
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1">
          Incorrect. Please try again or{' '}
          <button type="button" onClick={refresh}
            className="underline font-semibold">refresh</button>.
        </p>
      )}
      {status === 'success' && (
        <p className="text-xs text-green-600 mt-1 font-semibold">✓ CAPTCHA verified!</p>
      )}
      {status === 'idle' && (
        <p className="text-xs text-slate-400 mt-1">Case-sensitive. Click 🔄 to get a new one.</p>
      )}
    </div>
  )
}
