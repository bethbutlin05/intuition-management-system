import { useEffect, useState } from 'react'
import API_URL from '../services/api'

type Tutor = {
  id: number
  firstName: string
  lastName: string
}

type School = {
  id: number
  name: string
}

type Pupil = {
  id: number
  firstName: string
  lastName: string
  school: School
}

type Report = {
  id: number
  createdAt: string

  engagementScore: number
  attentionScore: number
  confidenceScore: number
  academicProgressScore: number

  lesson: {
    id: number
    subject: string
    startTime: string

    tutor: Tutor

    pupil: Pupil
  }
}

function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          `${API_URL}/reports`,
        )

        if (!response.ok) {
          throw new Error(
            'Failed to fetch reports',
          )
        }

        const data = await response.json()

        setReports(data)
      } catch (error) {
        console.error(error)

        setError(
          'Could not load submitted reports.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return <p>Loading reports...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports</h1>
          <p>
            View submitted Daily Learning &
            Progress Records.
          </p>
        </div>
      </div>

      {reports.length === 0 ? (
        <p>No reports have been submitted yet.</p>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div
              key={report.id}
              className="report-card"
            >
              <div>
                <h3>
                  {report.lesson.pupil.firstName}{' '}
                  {report.lesson.pupil.lastName}
                </h3>

                <p>
                  {report.lesson.subject}
                </p>
              </div>

              <div>
                <p>
                  <strong>Tutor:</strong>{' '}
                  {report.lesson.tutor.firstName}{' '}
                  {report.lesson.tutor.lastName}
                </p>

                <p>
                  <strong>School:</strong>{' '}
                  {
                    report.lesson.pupil.school
                      .name
                  }
                </p>

                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(
                    report.lesson.startTime,
                  ).toLocaleDateString('en-GB')}
                </p>
              </div>

              <div className="report-scores">
                <span>
                  Engagement{' '}
                  {report.engagementScore}/3
                </span>

                <span>
                  Attention{' '}
                  {report.attentionScore}/3
                </span>

                <span>
                  Confidence{' '}
                  {report.confidenceScore}/3
                </span>

                <span>
                  Progress{' '}
                  {
                    report.academicProgressScore
                  }/3
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReportsPage