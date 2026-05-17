/*
  Warnings:

  - A unique constraint covering the columns `[userId,fullName]` on the table `favorite_repositories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "favorite_repositories" ADD COLUMN     "ownerAvatarUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "favorite_repositories_userId_fullName_key" ON "favorite_repositories"("userId", "fullName");
