import { useEffect, useState } from 'react'
import API_URL from '../services/api'

type Tutor = {
  id: number
  firstName: string
  lastName: string
  role: string
}

type Pupil = {
  id: number
  firstName: string
  lastName: string
}

type LessonSchedule = {
  id: number
  tutorId: number
  pupilId: number
  subject: string
  dayOfWeek: string
  startTime: string
  duration: number
  venue: string | null
  active: boolean

  tutor: Tutor
  pupil: Pupil
}

const daysOfWeek = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]

function LessonSchedulesPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [pupils, setPupils] = useState<Pupil[]>([])
  const [lessonSchedules, setLessonSchedules] = useState<
    LessonSchedule[]
  >([])

  const [tutorId, setTutorId] = useState('')
  const [pupilId, setPupilId] = useState('')
  const [subject, setSubject] = useState('')
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState('')
  const [venue, setVenue] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          usersResponse,
          pupilsResponse,
          schedulesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/users`),
          fetch(`${API_URL}/pupils`),
          fetch(`${API_URL}/lesson-schedules`),
        ])

        if (
          !usersResponse.ok ||
          !pupilsResponse.ok ||
          !schedulesResponse.ok
        ) {
          throw new Error('Failed to fetch data')
        }

        const usersData = await usersResponse.json()
        const pupilsData = await pupilsResponse.json()
        const schedulesData = await schedulesResponse.json()

        const tutorUsers = usersData.filter(
          (user: Tutor) => user.role === 'TUTOR',
        )

        setTutors(tutorUsers)
        setPupils(pupilsData)
        setLessonSchedules(schedulesData)
      } catch (error) {
        console.error(error)
        setError('Could not load lesson schedule data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(
        `${API_URL}/lesson-schedules`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tutorId: Number(tutorId),
            pupilId: Number(pupilId),
            subject,
            dayOfWeek,
            startTime,
            duration: Number(duration),
            venue: venue || undefined,
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()

        throw new Error(
          errorData.error || 'Failed to create lesson schedule',
        )
      }

      const newSchedule = await response.json()

      setLessonSchedules((currentSchedules) => [
        ...currentSchedules,
        newSchedule,
      ])

      // Clear form
      setTutorId('')
      setPupilId('')
      setSubject('')
      setDayOfWeek('')
      setStartTime('')
      setDuration('')
      setVenue('')
    } catch (error) {
      console.error(error)

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Could not create lesson schedule')
      }
    }
  }

  if (loading) {
    return <h1>Loading regular lessons...</h1>
  }

  return (
    <div>
      <h1>Regular Lessons</h1>

      <p>
        Create regular weekly lessons for pupils and tutors.
      </p>

      {error && <p>{error}</p>}

      <h2>Schedule a Regular Lesson</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="pupil">Pupil‎  </label>

          <select
            id="pupil"
            value={pupilId}
            onChange={(event) =>
              setPupilId(event.target.value)
            }
            required
          >
            <option value="">Select a pupil</option>

            {pupils.map((pupil) => (
              <option key={pupil.id} value={pupil.id}>
                {pupil.firstName} {pupil.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tutor">Tutor‎ </label>

          <select
            id="tutor"
            value={tutorId}
            onChange={(event) =>
              setTutorId(event.target.value)
            }
            required
          >
            <option value="">Select a tutor</option>

            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.firstName} {tutor.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject">Subject‎ </label>

          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="dayOfWeek">Day‎ </label>

          <select
            id="dayOfWeek"
            value={dayOfWeek}
            onChange={(event) =>
              setDayOfWeek(event.target.value)
            }
            required
          >
            <option value="">Select a day</option>

            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startTime">Start time‎ </label>

          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(event) =>
              setStartTime(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="duration">Duration (minutes)‎ </label>

          <input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="venue">Venue‎ </label>

          <input
            id="venue"
            type="text"
            value={venue}
            onChange={(event) =>
              setVenue(event.target.value)
            }
          />
        </div>

        <button type="submit">
          Schedule Lesson
        </button>
      </form>

      <h2>Current Regular Lessons</h2>

      {lessonSchedules.length === 0 ? (
        <p>No regular lessons scheduled yet.</p>
      ) : (
        <ul>
          {lessonSchedules.map((schedule) => (
            <li key={schedule.id}>
              <strong>
                {schedule.pupil.firstName}{' '}
                {schedule.pupil.lastName}
              </strong>

              {' — '}

              {schedule.subject}

              {' with '}

              {schedule.tutor.firstName}{' '}
              {schedule.tutor.lastName}

              {' — '}

              {schedule.dayOfWeek.charAt(0) +
                schedule.dayOfWeek.slice(1).toLowerCase()}

              {' at '}

              {schedule.startTime}

              {' — '}

              {schedule.duration} minutes

              {schedule.venue && ` — ${schedule.venue}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LessonSchedulesPage