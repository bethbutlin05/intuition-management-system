# Database Design

## Entities

### USER

Represents a person who can log into the system.

- id
- firstName
- lastName
- email
- phone
- passwordHash
- role

### SCHOOL

Represents a school associated with one or more pupils.

- id
- name
- email
- phone

### PUPIL

Represents a pupil receiving tutoring.

- id
- firstName
- lastName
- schoolId

### TUTOR_ASSIGNMENT

Represents the relationship between tutors and pupils.

- tutorId
- pupilId

A tutor can be assigned to multiple pupils and a pupil can have
multiple tutors.

### LESSON

Represents an individual tutoring lesson.

- id
- pupilId
- tutorId
- date
- startTime
- duration
- subject
- venue

### REPORT

Represents the report completed following a lesson.

- id
- lessonId
- engagementScore
- attentionScore
- confidenceScore
- academicProgressScore
- emotionalRegulation
- emotionalRegulationReason
- lessonObjective
- studentOutcomes
- strategyImpact
- targetForNextSession
- tutorReflection
- createdAt
- updatedAt

### STRATEGY

Represents a strategy that can be used during a lesson.

- id
- name

### REPORT_STRATEGY

Associates reports with one or more strategies.

- reportId
- strategyId

### EVIDENCE_TYPE

Represents a type of evidence recorded in a report.

- id
- name

### REPORT_EVIDENCE

Associates reports with one or more evidence types.

- reportId
- evidenceTypeId