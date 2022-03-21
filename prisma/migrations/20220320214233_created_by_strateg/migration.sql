-- CreateEnum
CREATE TYPE "CreatedByStrategies" AS ENUM ('LOCAL', 'FACEBOOk', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdBy" "CreatedByStrategies" NOT NULL DEFAULT E'LOCAL';
