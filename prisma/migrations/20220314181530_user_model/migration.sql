-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CLIENT', 'CREATOR');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('EN', 'PL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lang" "Lang" NOT NULL DEFAULT E'EN',
    "accountType" "AccountType" NOT NULL DEFAULT E'CLIENT',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_details" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "profileImg" TEXT,
    "age" INTEGER,
    "gender" "Gender" NOT NULL DEFAULT E'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_addresses" (
    "id" SERIAL NOT NULL,
    "userDetailsId" INTEGER NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "zipCode" INTEGER,
    "address1" TEXT,
    "address2" TEXT,

    CONSTRAINT "users_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_addresses_userDetailsId_key" ON "users_addresses"("userDetailsId");

-- AddForeignKey
ALTER TABLE "users_details" ADD CONSTRAINT "users_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_addresses" ADD CONSTRAINT "users_addresses_userDetailsId_fkey" FOREIGN KEY ("userDetailsId") REFERENCES "users_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
