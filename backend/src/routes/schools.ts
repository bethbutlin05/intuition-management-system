import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all schools
router.get('/', async (_req, res) => {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    res.json(schools)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch schools',
    })
  }
})

// POST create a school
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'School name is required',
      })
    }

    const school = await prisma.school.create({
      data: {
        name,
        email,
        phone,
      },
    })

    res.status(201).json(school)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create school',
    })
  }
})

export default router