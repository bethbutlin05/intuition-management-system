import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all lessons
router.get('/', async (_req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        tutor: true,
        pupil: {
          include: {
            school: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    res.json(lessons)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch lessons',
    })
  }
})

// POST create a lesson
router.post('/', async (req, res) => {
  try {
    const {
      tutorId,
      pupilId,
      startTime,
      duration,
      subject,
      venue,
    } = req.body

    if (!tutorId || !pupilId || !startTime || !duration || !subject) {
      return res.status(400).json({
        error:
          'Tutor ID, pupil ID, start time, duration and subject are required',
      })
    }

    // Check that the tutor exists
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
        error: 'User must have the TUTOR role to create a lesson',
      })
    }

    // Check that the pupil exists
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

    // Check that the tutor is assigned to this pupil
    const assignment = await prisma.tutorAssignment.findUnique({
      where: {
        tutorId_pupilId: {
        tutorId,
        pupilId,
        },
      },
    })

    if (!assignment) {
      return res.status(400).json({
        error: 'This tutor is not assigned to this pupil',
      })
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        tutorId,
        pupilId,
        startTime: new Date(startTime),
        duration,
        subject,
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

    res.status(201).json(lesson)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create lesson',
    })
  }
})

export default router