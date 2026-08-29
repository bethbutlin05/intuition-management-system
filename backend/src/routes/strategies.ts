import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all strategies
router.get('/', async (_req, res) => {
  try {
    const strategies = await prisma.strategy.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    res.json(strategies)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch strategies',
    })
  }
})

// POST create a strategy
router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'Strategy name is required',
      })
    }

    const strategy = await prisma.strategy.create({
      data: {
        name,
      },
    })

    res.status(201).json(strategy)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create strategy',
    })
  }
})

export default router