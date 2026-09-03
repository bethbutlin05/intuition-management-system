import { useEffect, useState } from 'react'
import API_URL from '../services/api'

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

function PupilsPage() {
  const [pupils, setPupils] = useState<Pupil[]>([])
  const [schools, setSchools] = useState<School[]>([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [schoolId, setSchoolId] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [pupilsResponse, schoolsResponse] = await Promise.all([
          fetch(`${API_URL}/pupils`),
          fetch(`${API_URL}/schools`),
        ])

        if (!pupilsResponse.ok || !schoolsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const pupilsData = await pupilsResponse.json()
        const schoolsData = await schoolsResponse.json()

        setPupils(pupilsData)
        setSchools(schoolsData)
      } catch (error) {
        console.error(error)
        setError('Could not load pupils and schools')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(`${API_URL}/pupils`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          schoolId: Number(schoolId),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create pupil')
      }

      const newPupil = await response.json()

      setPupils((currentPupils) => [...currentPupils, newPupil])

      setFirstName('')
      setLastName('')
      setSchoolId('')
    } catch (error) {
      console.error(error)
      setError('Could not create pupil')
    }
  }

  if (loading) {
    return <h1>Loading pupils...</h1>
  }

  return (
    <div>
      <h1>Pupils</h1>

      {error && <p>{error}</p>}

      <h2>Add Pupil</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="school">School</label>

          <select
            id="school"
            value={schoolId}
            onChange={(event) => setSchoolId(event.target.value)}
          >
            <option value="">Select a school</option>

            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Pupil</button>
      </form>

      <h2>All Pupils</h2>

      {pupils.length === 0 ? (
        <p>No pupils found.</p>
      ) : (
        <ul>
          {pupils.map((pupil) => (
            <li key={pupil.id}>
              {pupil.firstName} {pupil.lastName} — {pupil.school.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PupilsPage