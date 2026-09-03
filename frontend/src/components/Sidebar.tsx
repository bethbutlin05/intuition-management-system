import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside>
      <h1>In-Tuition</h1>

      <nav>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/pupils">Pupils</Link>
          </li>

          <li>
            <Link to="/tutors">Tutors</Link>
          </li>

          <li>
            <Link to="/lesson-schedules">Regular Lessons</Link>
          </li>

          <li>
            <Link to="/reports/new">
              Add Report
            </Link>
          </li>

          <li>
            <Link to="/reports">
              Reports
            </Link>
          </li>

          <li>
            <Link to="/timetable">Timetable</Link>
          </li>

          <li>
            <Link to="/attendance">Attendance</Link>
          </li>

          <li>
            <Link to="/invoices">Invoices</Link>
          </li>

          <li>
            <Link to="/resources">Resources</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar