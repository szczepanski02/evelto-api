/*
  Warnings:

  - Changed the type of `authority` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Authority" AS ENUM ('ROOT', 'ADMIN', 'MODERATOR', 'IT_SUPPORT', 'DATA_SUPPORT', 'CLIENT_SUPPORT');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "authority",
ADD COLUMN     "authority" "Authority" NOT NULL;
