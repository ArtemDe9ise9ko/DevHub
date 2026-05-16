/*
  Warnings:

  - A unique constraint covering the columns `[jti]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - The required column `jti` was added to the `refresh_tokens` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "jti" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_jti_key" ON "refresh_tokens"("jti");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_jti_idx" ON "refresh_tokens"("userId", "jti");
