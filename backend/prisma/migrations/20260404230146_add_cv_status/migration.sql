-- CreateEnum
CREATE TYPE "CVStatus" AS ENUM ('PENDING', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "user_cvs" ADD COLUMN     "status" "CVStatus" NOT NULL DEFAULT 'PENDING';
