import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Button    from '../../components/ui/Button.jsx'
import FormInput from '../../components/ui/FormInput.jsx'
import toast from 'react-hot-toast'
import { Mail, Hash, GitBranch, BookOpen, Edit3, Save } from 'lucide-react'

export default function StudentProfile() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name:     user?.name     || '',
    email:    user?.email    || '',
    rollNo:   user?.rollNo   || 'CS2021001',
    branch:   user?.branch   || 'CSE',
    semester: user?.semester || '6th',
  })

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })
  const handleSave = () => { toast.success('Profile updated!'); setEditing(false) }

  const fields = [
    { icon: Mail,      label: 'Email',      value: user?.email },
    { icon: Hash,      label: 'Roll Number', value: user?.rollNo || 'CS2021001' },
    { icon: GitBranch, label: 'Branch',     value: user?.branch || 'CSE' },
    { icon: BookOpen,  label: 'Semester',   value: user?.semester || '6th' },
  ]

  return (
    <DashboardLayout>
      <div className="mb-7">
        <h1 className="page-title">My Profile</h1>
        <p className="text-slate-500 mt-1">Your personal academic information</p>
      </div>

      <div className="max-w-xl space-y-5">

        {/* Avatar card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600
            flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg shadow-emerald-100">
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.rollNo || 'CS2021001'} · {user?.branch || 'CSE'}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full
              text-xs font-semibold bg-emerald-100 text-emerald-700">
              <BookOpen size={11} /> Student
            </span>
          </div>
        </div>

        {/* Info card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Academic Information</h3>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Edit3 size={14} /> Edit
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={handleSave}>
                <Save size={14} /> Save
              </Button>
            )}
          </div>

          {editing ? (
            <div className="p-6 space-y-0">
              <FormInput label="Full Name"   value={form.name}     onChange={set('name')} />
              <FormInput label="Email"       value={form.email}    onChange={set('email')} type="email" />
              <FormInput label="Roll Number" value={form.rollNo}   onChange={set('rollNo')} />
              <FormInput label="Branch"      value={form.branch}   onChange={set('branch')} />
              <FormInput label="Semester"    value={form.semester} onChange={set('semester')} />
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {fields.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">{label}</div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
