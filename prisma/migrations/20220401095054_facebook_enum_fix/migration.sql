/*
  Warnings:

  - The values [FACEBOOk] on the enum `CreatedByStrategies` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CreatedByStrategies_new" AS ENUM ('LOCAL', 'FACEBOOK', 'GOOGLE');
ALTER TABLE "users" ALTER COLUMN "createdBy" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "createdBy" TYPE "CreatedByStrategies_new" USING ("createdBy"::text::"CreatedByStrategies_new");
ALTER TYPE "CreatedByStrategies" RENAME TO "CreatedByStrategies_old";
ALTER TYPE "CreatedByStrategies_new" RENAME TO "CreatedByStrategies";
DROP TYPE "CreatedByStrategies_old";
ALTER TABLE "users" ALTER COLUMN "createdBy" SET DEFAULT 'LOCAL';
COMMIT;
