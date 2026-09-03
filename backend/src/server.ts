import express from 'express'
import cors from 'cors'
import schoolRoutes from './routes/schools.js'
import pupilRoutes from './routes/pupils.js'
import userRoutes from './routes/users.js'
import lessonScheduleRoutes from './routes/lessonSchedules.js'
import lessonRoutes from './routes/lessons.js'
import reportRoutes from './routes/reports.js'
import strategyRoutes from './routes/strategies.js'
import evidenceTypeRoutes from './routes/evidenceTypes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/schools', schoolRoutes)
app.use('/api/pupils', pupilRoutes)
app.use('/api/users', userRoutes)
app.use('/api/lesson-schedules', lessonScheduleRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/strategies', strategyRoutes)
app.use('/api/evidence-types', evidenceTypeRoutes)

const PORT = 3000

app.get('/', (_req, res) => {
  res.send('inTuition Management System API is running!')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})