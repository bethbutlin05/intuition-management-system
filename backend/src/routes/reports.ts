import { Router } from 'express'
import prisma from '../prisma.js'

const router = Router()

// GET all reports
router.get('/', async (_req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        lesson: {
          include: {
            tutor: true,
            pupil: {
              include: {
                school: true,
              },
            },
          },
        },
        reportStrategies: {
          include: {
            strategy: true,
          },
        },
        reportEvidence: {
          include: {
            evidenceType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(reports)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch reports',
    })
  }
})

// GET one report by ID
router.get('/:id', async (req, res) => {
  try {
    const reportId = Number(req.params.id)

    const report = await prisma.report.findUnique({
      where: {
        id: reportId,
      },
      include: {
        lesson: {
          include: {
            tutor: true,
            pupil: {
              include: {
                school: true,
              },
            },
          },
        },
        reportStrategies: {
          include: {
            strategy: true,
          },
        },
        reportEvidence: {
          include: {
            evidenceType: true,
          },
        },
      },
    })

    if (!report) {
      return res.status(404).json({
        error: 'Report not found',
      })
    }

    res.json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to fetch report',
    })
  }
})

// POST create a report for a lesson
router.post('/', async (req, res) => {
  try {
    const {
      lessonId,
      engagementScore,
      attentionScore,
      confidenceScore,
      academicProgressScore,
      emotionalRegulation,
      emotionalRegulationExplanation,
      lessonObjective,
      lessonOutcome,
      strategyImpact,
      nextSessionTarget,
      tutorReflection,
      strategyIds,
      evidenceTypeIds,
    } = req.body

    // Required fields
    if (
      !lessonId ||
      engagementScore === undefined ||
      attentionScore === undefined ||
      confidenceScore === undefined ||
      academicProgressScore === undefined
    ) {
      return res.status(400).json({
        error:
          'Lesson ID and all four scores are required',
      })
    }

    const scores = [
      engagementScore,
      attentionScore,
      confidenceScore,
      academicProgressScore,
    ]

    const invalidScore = scores.some(
        (score) =>
        !Number.isInteger(score) ||
        score < 1 ||
        score > 3,
    )

    if (invalidScore) {
    return res.status(400).json({
        error: 'All scores must be whole numbers between 1 and 3',
    })
    }

    // Check the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    })

    if (!lesson) {
      return res.status(404).json({
        error: 'Lesson not found',
      })
    }

    const existingReport = await prisma.report.findUnique({
      where: {
        lessonId,
      },
    })

    if (existingReport) {
    return res.status(400).json({
        error: 'This lesson already has a report',
    })
    }

    // Create the report
    const report = await prisma.report.create({
      data: {
        lessonId,
        engagementScore,
        attentionScore,
        confidenceScore,
        academicProgressScore,
        emotionalRegulation,
        emotionalRegulationExplanation,
        lessonObjective,
        lessonOutcome,
        strategyImpact,
        nextSessionTarget,
        tutorReflection,

        // Connect selected strategies
        reportStrategies: {
          create:
            Array.isArray(strategyIds)
              ? strategyIds.map((strategyId: number) => ({
                  strategy: {
                    connect: {
                      id: strategyId,
                    },
                  },
                }))
              : [],
        },

        // Connect selected evidence types
        reportEvidence: {
          create:
            Array.isArray(evidenceTypeIds)
              ? evidenceTypeIds.map((evidenceTypeId: number) => ({
                  evidenceType: {
                    connect: {
                      id: evidenceTypeId,
                    },
                  },
                }))
              : [],
        },
      },

      include: {
        lesson: {
          include: {
            tutor: true,
            pupil: {
              include: {
                school: true,
              },
            },
          },
        },
        reportStrategies: {
          include: {
            strategy: true,
          },
        },
        reportEvidence: {
          include: {
            evidenceType: true,
          },
        },
      },
    })

    res.status(201).json(report)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Failed to create report',
    })
  }
})

export default router