/*
  Warnings:

  - You are about to drop the column `age` on the `users_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users_details" DROP COLUMN "age",
ADD COLUMN     "birthDate" TIMESTAMP(3);
