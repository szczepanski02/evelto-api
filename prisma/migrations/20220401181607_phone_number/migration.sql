/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `users_addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users_addresses" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "users_details" ADD COLUMN     "phoneNumber" TEXT;
