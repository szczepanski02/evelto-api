/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IPRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificatedIP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IPRequest" DROP CONSTRAINT "IPRequest_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "VerificatedIP" DROP CONSTRAINT "VerificatedIP_employeeId_fkey";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "IPRequest";

-- DropTable
DROP TABLE "VerificatedIP";

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ipVerification" BOOLEAN NOT NULL DEFAULT true,
    "profileImg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "authority" "Authority" NOT NULL DEFAULT E'MODERATOR',

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ipRequests" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ipRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificatedIPs" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "verificatedIPs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- AddForeignKey
ALTER TABLE "ipRequests" ADD CONSTRAINT "ipRequests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificatedIPs" ADD CONSTRAINT "verificatedIPs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
