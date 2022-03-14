/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `users_details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_details_userId_key" ON "users_details"("userId");
