import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all lesson schedules
router.get('/', async (_req, res) => {
  try {
    const lessonSchedules = await prisma.lessonSchedule.findMany({
      include: {
        tutor: true,
        pupil: {
          include: {
            school: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(lessonSchedules)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch lesson schedules',
    })
  }
})

// POST create a lesson schedule
router.post('/', async (req, res) => {
  try {
    const {
      tutorId,
      pupilId,
      subject,
      dayOfWeek,
      startTime,
      duration,
      venue,
    } = req.body

    // Check required fields
    if (
      !tutorId ||
      !pupilId ||
      !subject ||
      !dayOfWeek ||
      !startTime ||
      !duration
    ) {
      return res.status(400).json({
        error:
          'Tutor, pupil, subject, day, start time and duration are required',
      })
    }

    // Check tutor exists
    const tutor = await prisma.user.findUnique({
      where: {
        id: tutorId,
      },
    })

    if (!tutor) {
      return res.status(404).json({
        error: 'Tutor not found',
      })
    }

    if (tutor.role !== 'TUTOR') {
      return res.status(400).json({
        error: 'Selected user is not a tutor',
      })
    }

    // Check pupil exists
    const pupil = await prisma.pupil.findUnique({
      where: {
        id: pupilId,
      },
    })

    if (!pupil) {
      return res.status(404).json({
        error: 'Pupil not found',
      })
    }

    // Create the lesson schedule
    const lessonSchedule = await prisma.lessonSchedule.create({
      data: {
        tutorId,
        pupilId,
        subject,
        dayOfWeek,
        startTime,
        duration,
        venue,
      },
      include: {
        tutor: true,
        pupil: {
          include: {
            school: true,
          },
        },
      },
    })

    res.status(201).json(lessonSchedule)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create lesson schedule',
    })
  }
})

export default router