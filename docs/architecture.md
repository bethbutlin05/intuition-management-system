# Intuition Management System — Architecture

## Overview

The Intuition Management System is a web-based management platform
for a tutoring company.

The initial priority is to allow tutors to complete lesson reports,
store reports against pupils, track pupil progress, and allow
administrators to review and collate reports.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- Express
- TypeScript

### Database

- PostgreSQL

### ORM

- Prisma

### API

- REST

### Version Control

- Git
- GitHub

## Architecture

The application follows a client-server architecture.

The React frontend communicates with the Express backend through
a REST API.

The backend contains the application's business logic and
communicates with PostgreSQL through Prisma.

React Frontend
      |
      | HTTP / REST API
      v
Express Backend
      |
      | Prisma
      v
PostgreSQL Database