import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Sidebar from './components/Sidebar'

import DashboardPage from './pages/DashboardPage'
import PupilsPage from './pages/PupilsPage'
import TutorsPage from './pages/TutorsPage'
import ReportsPage from './pages/ReportsPage'
import TimetablePage from './pages/TimetablePage'
import AttendancePage from './pages/AttendancePage'
import InvoicesPage from './pages/InvoicesPage'
import ResourcesPage from './pages/ResourcesPage'

function App() {
  return (
    <BrowserRouter>
      <Sidebar />

      <main>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pupils" element={<PupilsPage />} />
          <Route path="/tutors" element={<TutorsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App