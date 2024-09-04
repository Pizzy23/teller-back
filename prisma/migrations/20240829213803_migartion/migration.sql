-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('STABLE', 'UNSTABLE', 'UNDER_OBSERVATION', 'EXPECTED_DISCHARGE', 'DISCHARGED', 'EXTERNAL_TRANSFER', 'WARD_TRANSFER', 'HOME_TRANSFER', 'DECEASE');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "RemovedPendencieEnum" AS ENUM ('NAN', 'HUMAN_ERROR', 'SYSTEM_ERROR', 'CHANGE_OF_CONDUCT');

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "side" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "medicalRecordNumber" TEXT,
    "birthDate" TIMESTAMP(3),
    "status" "StatusEnum" NOT NULL DEFAULT 'STABLE',
    "exams" TEXT,
    "watcher" BOOLEAN NOT NULL DEFAULT false,
    "medicalBackGround" TEXT[],
    "gender" "GenderEnum" NOT NULL DEFAULT 'MASCULINO',
    "medicalBed" TEXT NOT NULL,
    "lastUpdater" TEXT,
    "dateOfAdmission" TIMESTAMP(3),
    "heartBeat" TEXT,
    "fluidBalance" TEXT,
    "respoiratoryRate" TEXT,
    "arterialPressure" TEXT,
    "oxygenSaturation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "departmentId" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodGlucose" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "creationDate" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "BloodGlucose_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antibiotic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "applicationDate" TEXT,
    "removalDate" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Antibiotic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pendencie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN,
    "removed" "RemovedPendencieEnum",
    "assignedTo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Pendencie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "applicationDate" TEXT,
    "removalDate" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Culture" (
    "id" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "germs" TEXT[],
    "collectionDate" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Culture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impression" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "Impression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveProblem" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,

    CONSTRAINT "ActiveProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Patient_departmentId_idx" ON "Patient"("departmentId");

-- CreateIndex
CREATE INDEX "Pendencie_patientId_removed_completed_assignedTo_idx" ON "Pendencie"("patientId", "removed", "completed", "assignedTo");

-- CreateIndex
CREATE INDEX "Impression_patientId_assignedTo_idx" ON "Impression"("patientId", "assignedTo");

-- CreateIndex
CREATE INDEX "ActiveProblem_patientId_assignedTo_idx" ON "ActiveProblem"("patientId", "assignedTo");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodGlucose" ADD CONSTRAINT "BloodGlucose_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antibiotic" ADD CONSTRAINT "Antibiotic_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pendencie" ADD CONSTRAINT "Pendencie_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Culture" ADD CONSTRAINT "Culture_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveProblem" ADD CONSTRAINT "ActiveProblem_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
