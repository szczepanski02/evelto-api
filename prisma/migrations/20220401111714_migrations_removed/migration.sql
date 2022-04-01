-- CreateEnum
CREATE TYPE "Authority" AS ENUM ('ROOT', 'ADMIN', 'MODERATOR', 'IT_SUPPORT', 'DATA_SUPPORT', 'CLIENT_SUPPORT');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CLIENT', 'CREATOR');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('en', 'pl');

-- CreateEnum
CREATE TYPE "ClientIsActive" AS ENUM ('IS_ACTIVE', 'BLOCKED', 'EMAIL_VERIFICATION', 'PROFILE_NOT_COMPLETE');

-- CreateEnum
CREATE TYPE "CreatedByStrategies" AS ENUM ('LOCAL', 'FACEBOOK', 'GOOGLE');

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
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" "ClientIsActive" NOT NULL,
    "createdBy" "CreatedByStrategies" NOT NULL DEFAULT E'LOCAL',
    "lang" "Lang" NOT NULL DEFAULT E'en',
    "accountType" "AccountType" NOT NULL DEFAULT E'CLIENT',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_details" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileImg" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" "Gender" NOT NULL DEFAULT E'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_addresses" (
    "id" SERIAL NOT NULL,
    "userDetailsId" INTEGER NOT NULL,
    "phoneNumber" TEXT,
    "country" TEXT,
    "city" TEXT,
    "zipCode" TEXT,
    "address1" TEXT,
    "address2" TEXT,

    CONSTRAINT "users_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_details" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "verificated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "creator_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_username_key" ON "employees"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_details_userId_key" ON "users_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_addresses_userDetailsId_key" ON "users_addresses"("userDetailsId");

-- CreateIndex
CREATE UNIQUE INDEX "creator_details_userId_key" ON "creator_details"("userId");

-- AddForeignKey
ALTER TABLE "ipRequests" ADD CONSTRAINT "ipRequests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verificatedIPs" ADD CONSTRAINT "verificatedIPs_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_details" ADD CONSTRAINT "users_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_userDetailsId_fkey" FOREIGN KEY ("userDetailsId") REFERENCES "users_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_details" ADD CONSTRAINT "creator_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
