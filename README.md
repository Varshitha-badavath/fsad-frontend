# FSAD-PS25 — Online Assignment Submission & Grading System

A production-ready React frontend for managing university assignments, submissions, and grading.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🔐 Demo Login Credentials

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Teacher | sarah@university.edu     | teacher123  |
| Student | alex@student.edu         | student123  |
| Student | priya@student.edu        | student123  |

---

## 📁 Project Structure

```
src/
├── App.jsx                         ← Root component, route config
├── main.jsx                        ← React entry point
├── index.css                       ← Tailwind + global styles
│
├── context/
│   └── AuthContext.jsx             ← Global auth state (login/signup/logout)
│
├── routes/
│   └── ProtectedRoute.jsx          ← Role-based route guard
│
├── layouts/
│   ├── AuthLayout.jsx              ← Centered card layout for auth pages
│   └── DashboardLayout.jsx        ← Sidebar + topbar shell
│
├── components/
│   ├── Sidebar.jsx                 ← Collapsible role-aware navigation
│   ├── Topbar.jsx                  ← Top header bar
│   ├── AssignmentCard.jsx          ← Assignment display card (teacher)
│   ├── CreateAssignmentModal.jsx   ← Create assignment form
│   ├── SubmissionsModal.jsx        ← View + grade submissions (teacher)
│   ├── SubmitAssignmentModal.jsx   ← File upload + submit (student)
│   └── ui/
│       ├── Button.jsx              ← Multi-variant button
│       ├── FormInput.jsx           ← Input with label, error, password toggle
│       ├── SelectInput.jsx         ← Dropdown select
│       ├── Badge.jsx               ← Status pill badge
│       ├── Modal.jsx               ← Accessible dialog modal
│       ├── StatCard.jsx            ← Dashboard metric card
│       ├── FileUpload.jsx          ← Drag & drop file picker
│       └── EmptyState.jsx          ← Empty list placeholder
│
├── pages/
│   ├── Home.jsx                    ← Public landing page
│   ├── NotFound.jsx                ← 404 page
│   ├── teacher/
│   │   ├── TeacherLogin.jsx
│   │   ├── TeacherSignup.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── TeacherAssignments.jsx
│   │   ├── TeacherSubmissions.jsx
│   │   └── TeacherProfile.jsx
│   └── student/
│       ├── StudentLogin.jsx
│       ├── StudentSignup.jsx
│       ├── StudentDashboard.jsx
│       ├── StudentAssignments.jsx
│       ├── StudentSubmissions.jsx
│       └── StudentProfile.jsx
│
└── utils/
    ├── mockData.js                 ← Mock users, assignments, submissions
    ├── api.js                      ← Axios API service (backend-ready)
    └── helpers.js                  ← Date, validation, misc utilities
```

---

## 🔌 Connecting to a Real Backend

1. Set your API base URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

2. In `src/context/AuthContext.jsx`:
   - Uncomment the `authAPI` import
   - Replace mock `setTimeout` logic with real API calls
   - Store the JWT token: `localStorage.setItem('fsad_token', res.token)`

3. In each page component, replace `MOCK_*` data imports with API calls:
```js
import { assignmentAPI } from '../../utils/api.js'

const [assignments, setAssignments] = useState([])
useEffect(() => {
  assignmentAPI.getAll().then(setAssignments)
}, [])
```

---

## 🛣️ Routes

| Path                     | Access    | Description              |
|--------------------------|-----------|--------------------------|
| `/`                      | Public    | Landing page             |
| `/teacher/login`         | Public    | Teacher login            |
| `/teacher/signup`        | Public    | Teacher registration     |
| `/student/login`         | Public    | Student login            |
| `/student/signup`        | Public    | Student registration     |
| `/teacher/dashboard`     | Teacher   | Dashboard + stats        |
| `/teacher/assignments`   | Teacher   | Manage assignments       |
| `/teacher/submissions`   | Teacher   | Review all submissions   |
| `/teacher/profile`       | Teacher   | Profile page             |
| `/student/dashboard`     | Student   | Dashboard + submit       |
| `/student/assignments`   | Student   | View all assignments     |
| `/student/submissions`   | Student   | My submission history    |
| `/student/profile`       | Student   | Profile page             |

---

## 🧰 Tech Stack

- **React 18** + Vite
- **React Router DOM v6**
- **Context API** — auth state management
- **Tailwind CSS v3** — utility-first styling
- **Axios** — HTTP client (API-ready structure)
- **react-hot-toast** — toast notifications
- **lucide-react** — icon library

---

## ✨ Features

- ✅ Separate Teacher / Student auth flows
- ✅ Role-based protected routes
- ✅ Collapsible sidebar navigation
- ✅ Teacher: create assignments, view submissions, grade with feedback
- ✅ Student: view assignments, file upload submission, track grades
- ✅ Form validation on all inputs
- ✅ Show/hide password toggle
- ✅ Toast notifications (success/error)
- ✅ Status badges (Graded / Pending / Late / Active)
- ✅ Responsive — mobile + desktop
- ✅ Due date overdue detection
- ✅ Search + filter on assignment lists
- ✅ LocalStorage auth persistence
- ✅ API service layer ready for backend
