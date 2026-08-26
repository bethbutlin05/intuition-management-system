export type Score = 1 | 2 | 3

export type EmotionalRegulation =
  | 'regulated'
  | 'partially_regulated'
  | 'dysregulated'

export interface Report {
  id: number
  lessonId: number
  tutorId: number
  pupilId: number
  date: string

  engagementScore: Score
  attentionScore: Score
  confidenceScore: Score
  academicProgressScore: Score

  emotionalRegulation: EmotionalRegulation
  emotionalRegulationExplanation: string

  strategies: string[] // string for multiple choice
  evidence: string[]
}