import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all users
router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: [
        {
          lastName: 'asc',
        },
        {
          firstName: 'asc',
        },
      ],
    })

    res.json(users)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch users',
    })
  }
})

// GET all tutors
router.get('/tutors', async (_req, res) => {
  try {
    const tutors = await prisma.user.findMany({
      where: {
        role: 'TUTOR',
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

    res.json(tutors)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch tutors',
    })
  }
})

// POST create a user
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role } = req.body

    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({
        error: 'First name, last name, email and role are required',
      })
    }

    if (role !== 'ADMIN' && role !== 'TUTOR') {
      return res.status(400).json({
        error: 'Role must be ADMIN or TUTOR',
      })
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        role,
      },
    })

    res.status(201).json(user)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create user',
    })
  }
})

export default router