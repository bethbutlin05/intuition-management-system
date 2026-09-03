import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'

import DashboardPage from './pages/DashboardPage'
import PupilsPage from './pages/PupilsPage'
import TutorsPage from './pages/TutorsPage'
import ViewReportsPage from './pages/ViewReportsPage'
import CreateReportsPage from './pages/CreateReportsPage'
import TimetablePage from './pages/TimetablePage'
import AttendancePage from './pages/AttendancePage'
import InvoicesPage from './pages/InvoicesPage'
import ResourcesPage from './pages/ResourcesPage'
import LessonSchedulesPage from './pages/LessonSchedulesPage'

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pupils" element={<PupilsPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/reports" element={<ViewReportsPage />} />
          <Route path="/reports/new" element={<CreateReportsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/lesson-schedules" element={<LessonSchedulesPage />}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App