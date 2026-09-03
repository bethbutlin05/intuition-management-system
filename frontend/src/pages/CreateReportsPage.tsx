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

type Lesson = {
  id: number
  subject: string
  startTime: string
  duration: number
  venue: string | null
  tutor: Tutor
  pupil: Pupil
}

type Strategy = {
  id: number
  name: string
}

type EvidenceType = {
  id: number
  name: string
}

const emotionalRegulationOptions = [
  'CALM',
  'HAPPY',
  'ANXIOUS',
  'WITHDRAWN',
  'TIRED',
  'DYSREGULATED',
  'UNCONTROLLED',
  'OTHER',
]

function ReportsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [evidenceTypes, setEvidenceTypes] = useState<EvidenceType[]>([])

  const [lessonId, setLessonId] = useState('')
  const [engagementScore, setEngagementScore] = useState<number | null>(null)
  const [attentionScore, setAttentionScore] = useState<number | null>(null)
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null)
  const [academicProgressScore, setAcademicProgressScore] =
    useState<number | null>(null)

  const [emotionalRegulation, setEmotionalRegulation] = useState('')
  const [
    emotionalRegulationExplanation,
    setEmotionalRegulationExplanation,
  ] = useState('')

  const [lessonObjective, setLessonObjective] = useState('')
  const [pupilActivity, setPupilActivity] = useState('')
  const [lessonOutcome, setLessonOutcome] = useState('')
  const [strategyImpact, setStrategyImpact] = useState('')
  const [nextSessionTarget, setNextSessionTarget] = useState('')
  const [tutorReflection, setTutorReflection] = useState('')

  const [selectedStrategyIds, setSelectedStrategyIds] =
    useState<number[]>([])

  const [selectedEvidenceTypeIds, setSelectedEvidenceTypeIds] =
    useState<number[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [loadingError, setLoadingError] = useState('')

  useEffect(() => {
    async function fetchFormData() {
      try {
        const [
          lessonsResponse,
          strategiesResponse,
          evidenceTypesResponse,
          reportsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/lessons`),
          fetch(`${API_URL}/strategies`),
          fetch(`${API_URL}/evidence-types`),
          fetch(`${API_URL}/reports`),
        ])

        if (
          !lessonsResponse.ok ||
          !strategiesResponse.ok ||
          !evidenceTypesResponse.ok ||
          !reportsResponse.ok
        ) {
          throw new Error('Failed to load report form data')
        }

        const lessonsData = await lessonsResponse.json()
        const strategiesData = await strategiesResponse.json()
        const evidenceTypesData = await evidenceTypesResponse.json()

        setLessons(lessonsData)
        setStrategies(strategiesData)
        setEvidenceTypes(evidenceTypesData)
      } catch (error) {
        console.error(error)
        setLoadingError('Could not load the report form')
      } finally {
        setLoading(false)
      }
    }

    fetchFormData()
  }, [])

  const selectedLesson = lessons.find(
    (lesson) => lesson.id === Number(lessonId),
  )

  function toggleStrategy(strategyId: number) {
    setSelectedStrategyIds((currentIds) =>
      currentIds.includes(strategyId)
        ? currentIds.filter((id) => id !== strategyId)
        : [...currentIds, strategyId],
    )
  }

  function toggleEvidenceType(evidenceTypeId: number) {
    setSelectedEvidenceTypeIds((currentIds) =>
      currentIds.includes(evidenceTypeId)
        ? currentIds.filter((id) => id !== evidenceTypeId)
        : [...currentIds, evidenceTypeId],
    )
  }

  async function handleSubmit() {
    console.log('handleSubmit ran')
    setError('')
    setSuccessMessage('')

    if (
        !lessonId ||
        engagementScore === null ||
        attentionScore === null ||
        confidenceScore === null ||
        academicProgressScore === null
    ) {
        console.log('validation failed')
        setError(
        'Please select a lesson and complete all four scores.',
        )

        return
    }

    try {
        const response = await fetch(
        `${API_URL}/reports`,
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            lessonId: Number(lessonId),

            engagementScore,
            attentionScore,
            confidenceScore,
            academicProgressScore,

            emotionalRegulation:
                emotionalRegulation || null,

            emotionalRegulationExplanation:
                emotionalRegulationExplanation || null,

            lessonObjective:
                lessonObjective || null,

            pupilActivity:
                pupilActivity || null,

            lessonOutcome:
                lessonOutcome || null,

            strategyImpact:
                strategyImpact || null,

            nextSessionTarget:
                nextSessionTarget || null,

            tutorReflection:
                tutorReflection || null,

            strategyIds: selectedStrategyIds,

            evidenceTypeIds:
                selectedEvidenceTypeIds,
            }),
        },
        )

        const data = await response.json()

        if (!response.ok) {
        throw new Error(
            data.error || 'Failed to save report',
        )
        }

        setSuccessMessage(
        'Report saved successfully.',
        )

        resetForm()
      } catch (error) {
        console.error(error)

        if (error instanceof Error) {
        setError(error.message)
        } else {
        setError('Could not save report')
        }
      }
  }

  function resetForm() {
    setLessonId('')

    setEngagementScore(null)
    setAttentionScore(null)
    setConfidenceScore(null)
    setAcademicProgressScore(null)

    setEmotionalRegulation('')
    setEmotionalRegulationExplanation('')

    setLessonObjective('')
    setPupilActivity('')
    setLessonOutcome('')
    setStrategyImpact('')
    setNextSessionTarget('')
    setTutorReflection('')

    setSelectedStrategyIds([])
    setSelectedEvidenceTypeIds([])
  }

  if (loading) {
    return <h1>Loading report form...</h1>
  }

  if (loadingError) {
    return <h1>{loadingError}</h1>
  }

  return (
    <div>
      <h1>Daily Learning & Progress Record</h1>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="success-message">
          {successMessage}
        </p>
      )}

      <section>
        <label>
          Lesson ‎ 
          <select
            value={lessonId}
            onChange={(event) => {
              setLessonId(event.target.value)
              setSuccessMessage('')
            }}
          >
            <option value="">
              Select a lesson
            </option>

            {lessons.map((lesson) => (
              <option
                key={lesson.id}
                value={lesson.id}
              >
                {lesson.pupil.firstName}{' '}
                {lesson.pupil.lastName} —{' '}
                {lesson.subject}
              </option>
            ))}
          </select>
        </label>

        {selectedLesson && (
          <div className="lesson-summary">
            <p>
              <strong>Learner:</strong>{' '}
              {selectedLesson.pupil.firstName}{' '}
              {selectedLesson.pupil.lastName}
            </p>

            <p>
              <strong>Tutor:</strong>{' '}
              {selectedLesson.tutor.firstName}{' '}
              {selectedLesson.tutor.lastName}
            </p>

            <p>
              <strong>School:</strong>{' '}
              {selectedLesson.pupil.school.name}
            </p>

            <p>
              <strong>Subject:</strong>{' '}
              {selectedLesson.subject}
            </p>

            <p>
              <strong>Date:</strong>{' '}
              {new Date(
                selectedLesson.startTime,
              ).toLocaleDateString('en-GB')}
            </p>

            <p>
              <strong>Time:</strong>{' '}
              {new Date(
                selectedLesson.startTime,
              ).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            {selectedLesson.venue && (
              <p>
                <strong>Venue:</strong>{' '}
                {selectedLesson.venue}
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        <h2>Wellbeing, Engagement & Progress</h2>

        <ScoreField
          label="Engagement & Participation"
          value={engagementScore}
          onChange={setEngagementScore}
          lowLabel="Total refusal"
          highLabel="Fully engaged"
        />

        <ScoreField
          label="Attention & Task Completion"
          value={attentionScore}
          onChange={setAttentionScore}
          lowLabel="No tasks completed"
          highLabel="All tasks completed"
        />

        <ScoreField
          label="Confidence & Self Esteem"
          value={confidenceScore}
          onChange={setConfidenceScore}
          lowLabel="I cannot do this"
          highLabel="I can do this"
        />

        <ScoreField
          label="Academic Progress"
          value={academicProgressScore}
          onChange={setAcademicProgressScore}
          lowLabel="No progress"
          highLabel="Lots of progress"
        />
      </section>

      <section>
        <h2>Emotional Regulation</h2>

        <div className="option-grid">
          {emotionalRegulationOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="emotionalRegulation"
                value={option}
                checked={emotionalRegulation === option}
                onChange={(event) =>
                  setEmotionalRegulation(event.target.value)
                }
              />

              {formatEnum(option)}
            </label>
          ))}
        </div>

        <div className="form-field">
          <label>Please give an explanation for your choice:</label>

          <textarea
            className="textarea"
            value={emotionalRegulationExplanation}
            onChange={(event) =>
              setEmotionalRegulationExplanation(
                event.target.value,
              )
            }
          />
        </div>
      </section>

      <section>
        <h2>Lesson Information</h2>

        <div className="form-field">
          <label>Lesson Objective</label>

          <textarea
            className="textarea"
            value={lessonObjective}
            onChange={(event) =>
              setLessonObjective(event.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>What did the pupil do?</label>

          <textarea
            className="textarea-medium"
            value={pupilActivity}
            onChange={(event) =>
              setPupilActivity(event.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>
            What progress or outcomes were achieved?
          </label>

          <textarea
            className="textarea-medium"
            value={lessonOutcome}
            onChange={(event) =>
              setLessonOutcome(event.target.value)
            }
          />
        </div>
      </section>

      <section>
        <h2>Strategies Implemented</h2>

        <div className="option-grid">
          {strategies.map((strategy) => (
            <label key={strategy.id}>
              <input
                type="checkbox"
                checked={selectedStrategyIds.includes(
                  strategy.id,
                )}
                onChange={() =>
                  toggleStrategy(strategy.id)
                }
              />

              {strategy.name}
            </label>
          ))}
        </div>

        <div className="form-field">
          <label>Describe the impact of using chosen strategies:</label>

          <textarea
            className="textarea"
            value={strategyImpact}
            onChange={(event) =>
              setStrategyImpact(event.target.value)
            }
          />
        </div>
      </section>

      <section>
        <h2>Reflection & Next Steps</h2>

        <div className="form-field">
          <label>Target for next lesson:</label>

          <textarea
            className="textarea"
            value={nextSessionTarget}
            onChange={(event) =>
              setNextSessionTarget(event.target.value)
            }
          />
        </div>

        <div className="form-field">
          <label>Tutor reflection:</label>

          <textarea
            className="textarea"
            value={tutorReflection}
            onChange={(event) =>
              setTutorReflection(event.target.value)
            }
          />
        </div>
      </section>

      <section>
        <h2>Evidence Collected Today</h2>

        <div className="option-grid">
          {evidenceTypes.map((evidenceType) => (
            <label key={evidenceType.id}>
              <input
                type="checkbox"
                checked={selectedEvidenceTypeIds.includes(
                  evidenceType.id,
                )}
                onChange={() =>
                  toggleEvidenceType(evidenceType.id)
                }
              />

              {evidenceType.name}
            </label>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={handleSubmit}
      >
        Save Report
      </button>
    </div>
  )
}

type ScoreFieldProps = {
  label: string
  value: number | null
  onChange: (score: number) => void
  lowLabel: string
  highLabel: string
}

function ScoreField({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: ScoreFieldProps) {
  return (
    <div className="score-field">
      <h3>{label}</h3>

      <label>
        <input
          type="radio"
          name={label}
          checked={value === 1}
          onChange={() => onChange(1)}
        />
        1 — {lowLabel}
      </label>

      <label>
        <input
          type="radio"
          name={label}
          checked={value === 2}
          onChange={() => onChange(2)}
        />
        2
      </label>

      <label>
        <input
          type="radio"
          name={label}
          checked={value === 3}
          onChange={() => onChange(3)}
        />
        3 — {highLabel}
      </label>
    </div>
  )
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

export default ReportsPage