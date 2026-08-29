import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all tutor assignments
router.get('/', async (_req, res) => {
  try {
    const assignments = await prisma.tutorAssignment.findMany({
      include: {
        tutor: true,
        pupil: {
          include: {
            school: true,
          },
        },
      },
    })

    res.json(assignments)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch tutor assignments',
    })
  }
})

// POST assign a tutor to a pupil
router.post('/', async (req, res) => {
  try {
    const { tutorId, pupilId } = req.body

    if (!tutorId || !pupilId) {
      return res.status(400).json({
        error: 'Tutor ID and pupil ID are required',
      })
    }

    // Check that the tutor exists and is actually a tutor
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
        error: 'User must have the TUTOR role to be assigned to a pupil',
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

    // Create the assignment
    const assignment = await prisma.tutorAssignment.create({
      data: {
        tutorId,
        pupilId,
      },
      include: {
        tutor: true,
        pupil: true,
      },
    })

    res.status(201).json(assignment)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create tutor assignment',
    })
  }
})

export default router