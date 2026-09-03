import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all evidence types
router.get('/', async (_req, res) => {
  try {
    const evidenceTypes = await prisma.evidenceType.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    res.json(evidenceTypes)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch evidence types',
    })
  }
})

// POST create an evidence type
router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        error: 'Evidence type name is required',
      })
    }

    const evidenceType = await prisma.evidenceType.create({
      data: {
        name,
      },
    })

    res.status(201).json(evidenceType)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create evidence type',
    })
  }
})

// DELETE an evidence type
router.delete('/:id', async (req, res) => {
  try {
    const evidenceTypeId = Number(req.params.id)

    if (Number.isNaN(evidenceTypeId)) {
      return res.status(400).json({
        error: 'Invalid evidence type ID',
      })
    }

    await prisma.$transaction([
      prisma.reportEvidence.deleteMany({
        where: {
          evidenceTypeId,
        },
      }),

      prisma.evidenceType.delete({
        where: {
          id: evidenceTypeId,
        },
      }),
    ])

    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to delete evidence type',
    })
  }
})

export default router