/*
  Warnings:

  - The values [EN,PL] on the enum `Lang` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Lang_new" AS ENUM ('en', 'pl');
ALTER TABLE "users" ALTER COLUMN "lang" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "lang" TYPE "Lang_new" USING ("lang"::text::"Lang_new");
ALTER TYPE "Lang" RENAME TO "Lang_old";
ALTER TYPE "Lang_new" RENAME TO "Lang";
DROP TYPE "Lang_old";
ALTER TABLE "users" ALTER COLUMN "lang" SET DEFAULT 'en';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "lang" SET DEFAULT E'en';
