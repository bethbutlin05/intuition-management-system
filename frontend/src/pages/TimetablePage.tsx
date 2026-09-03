import { Fragment, useEffect, useState } from 'react'
import API_URL from '../services/api'

type Tutor = {
  id: number
  firstName: string
  lastName: string
}

type Pupil = {
  id: number
  firstName: string
  lastName: string
}

type LessonSchedule = {
  id: number
  subject: string
  dayOfWeek: string
  startTime: string
  duration: number
  venue: string | null

  tutor: Tutor
  pupil: Pupil
}

const days = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
]

const times = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

function TimetablePage() {
  const [lessonSchedules, setLessonSchedules] = useState<
    LessonSchedule[]
  >([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchLessonSchedules() {
      try {
        const response = await fetch(
          `${API_URL}/lesson-schedules`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch lesson schedules')
        }

        const data = await response.json()

        setLessonSchedules(data)
      } catch (error) {
        console.error(error)
        setError('Could not load timetable')
      } finally {
        setLoading(false)
      }
    }

    fetchLessonSchedules()
  }, [])

  if (loading) {
    return <h1>Loading timetable...</h1>
  }

  if (error) {
    return <h1>{error}</h1>
  }

  return (
    <div>
      <h1>Timetable</h1>

      <p>Weekly overview of regular lessons.</p>

      <div className="timetable">
        <div className="timetable-header time-column">
          Time
        </div>

        {days.map((day) => (
          <div
            key={day}
            className="timetable-header"
          >
            {day.charAt(0) + day.slice(1).toLowerCase()}
          </div>
        ))}

        {times.map((time) => (
            <Fragment key={time}>
                <div
                className="time-cell"
                >
                {time}
                </div>

                {days.map((day) => {
                const lessons = lessonSchedules.filter(
                    (lesson) =>
                    lesson.dayOfWeek === day &&
                    lesson.startTime === time,
                )

                return (
                    <div
                    key={`${day}-${time}`}
                    className="timetable-cell"
                    >
                    {lessons.map((lesson) => (
                        <div
                        key={lesson.id}
                        className="lesson-card"
                        >
                        <strong>
                            {lesson.pupil.firstName}{' '}
                            {lesson.pupil.lastName}
                        </strong>

                        <br />

                        {lesson.subject}

                        <br />

                        {lesson.tutor.firstName}{' '}
                        {lesson.tutor.lastName}

                        <br />

                        {lesson.startTime} —{' '}
                        {lesson.duration} mins

                        {lesson.venue && (
                            <>
                            <br />
                            {lesson.venue}
                            </>
                        )}
                        </div>
                    ))}
                    </div>
                )
                })}
            </Fragment>
        ))}
      </div>
    </div>
  )
}

export default TimetablePage