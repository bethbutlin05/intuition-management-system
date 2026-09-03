/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the `TutorAssignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "TutorAssignment" DROP CONSTRAINT "TutorAssignment_pupilId_fkey";

-- DropForeignKey
ALTER TABLE "TutorAssignment" DROP CONSTRAINT "TutorAssignment_tutorId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "scheduleId" INTEGER;

-- DropTable
DROP TABLE "TutorAssignment";

-- CreateTable
CREATE TABLE "LessonSchedule" (
    "id" SERIAL NOT NULL,
    "tutorId" INTEGER NOT NULL,
    "pupilId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "venue" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonSchedule" ADD CONSTRAINT "LessonSchedule_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSchedule" ADD CONSTRAINT "LessonSchedule_pupilId_fkey" FOREIGN KEY ("pupilId") REFERENCES "Pupil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "LessonSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
