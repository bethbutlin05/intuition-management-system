import { useEffect, useState } from 'react'
import API_URL from '../services/api'

type Tutor = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role: 'TUTOR'
}

function TutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTutors() {
      try {
        const response = await fetch(`${API_URL}/users`)

        if (!response.ok) {
          throw new Error('Failed to fetch tutors')
        }

        const data = await response.json()

        const tutorUsers = data.filter(
          (user: Tutor) => user.role === 'TUTOR',
        )

        setTutors(tutorUsers)
      } catch (error) {
        console.error(error)
        setError('Could not load tutors')
      } finally {
        setLoading(false)
      }
    }

    fetchTutors()
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          role: 'TUTOR',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create tutor')
      }

      const newTutor = await response.json()

      setTutors((currentTutors) => [...currentTutors, newTutor])

      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
    } catch (error) {
      console.error(error)
      setError('Could not create tutor')
    }
  }

  if (loading) {
    return <h1>Loading tutors...</h1>
  }

  return (
    <div>
      <h1>Tutors</h1>

      {error && <p>{error}</p>}

      <h2>Add Tutor</h2>

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
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="phone">Phone (optional)</label>

          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <button type="submit">Add Tutor</button>
      </form>

      <h2>All Tutors</h2>

      {tutors.length === 0 ? (
        <p>No tutors found.</p>
      ) : (
        <ul>
          {tutors.map((tutor) => (
            <li key={tutor.id}>
              {tutor.firstName} {tutor.lastName} — {tutor.email}
              {tutor.phone && ` — ${tutor.phone}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TutorsPage