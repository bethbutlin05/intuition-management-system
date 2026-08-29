import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all pupils
router.get('/', async (_req, res) => {
  try {
    const pupils = await prisma.pupil.findMany({
      include: {
        school: true,
      },
      orderBy: [
        {
          lastName: 'asc',
        },
        {
          firstName: 'asc',
        },
      ],
    })

    res.json(pupils)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch pupils',
    })
  }
})

// POST create a pupil
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, schoolId } = req.body

    if (!firstName || !lastName || !schoolId) {
      return res.status(400).json({
        error: 'First name, last name and school ID are required',
      })
    }

    const pupil = await prisma.pupil.create({
      data: {
        firstName,
        lastName,
        schoolId,
      },
      include: {
        school: true,
      },
    })

    res.status(201).json(pupil)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create pupil',
    })
  }
})

export default router