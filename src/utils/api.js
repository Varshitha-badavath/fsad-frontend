import axios from 'axios'

// ─── Base Instance ─────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fsad_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor: handle 401 globally ───────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fsad_token')
      localStorage.removeItem('fsad_user')
      window.location.href = '/'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  teacherLogin:  (data) => api.post('/auth/teacher/login', data),
  teacherSignup: (data) => api.post('/auth/teacher/signup', data),
  verifyOTP:     (data) => api.post('/auth/teacher/verify-otp', data),
  resendOTP:     (data) => api.post('/auth/teacher/resend-otp', data),
  studentLogin:  (data) => api.post('/auth/student/login', data),
  studentSignup: (data) => api.post('/auth/student/signup', data),
  logout:        ()     => api.post('/auth/logout'),
  getProfile:    ()     => api.get('/auth/profile'),
}

// ─── Assignment API ───────────────────────────────────────────────────────────
export const assignmentAPI = {
  getAll:    ()         => api.get('/assignments'),
  getById:   (id)       => api.get(`/assignments/${id}`),
  create:    (data)     => api.post('/assignments', data),
  update:    (id, data) => api.put(`/assignments/${id}`, data),
  delete:    (id)       => api.delete(`/assignments/${id}`),
  getMyAssignments: ()  => api.get('/assignments/student/my'),
}

// ─── Submission API ───────────────────────────────────────────────────────────
export const submissionAPI = {
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  getMySubmissions: ()            => api.get('/submissions/my'),
  submit:          (formData)     => api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  grade:           (id, data)     => api.put(`/submissions/${id}/grade`, data),
  getById:         (id)           => api.get(`/submissions/${id}`),
}

// ─── Stats API ────────────────────────────────────────────────────────────────
export const statsAPI = {
  teacherStats: () => api.get('/stats/teacher'),
  studentStats: () => api.get('/stats/student'),
}

export default api
