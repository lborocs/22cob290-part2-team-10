/*
  Warnings:

  - You are about to drop the column `managerId` on the `Project` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "leaderId" TEXT NOT NULL,
    CONSTRAINT "Project_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("id", "leaderId", "name") SELECT "id", "leaderId", "name" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leftCompany" BOOLEAN NOT NULL DEFAULT false,
    "inviteToken" TEXT,
    "avatarBg" TEXT NOT NULL DEFAULT '#e2ba39',
    "avatarFg" TEXT NOT NULL DEFAULT '#ffffff',
    "isManager" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatarBg", "avatarFg", "email", "hashedPassword", "id", "inviteToken", "leftCompany", "name") SELECT "avatarBg", "avatarFg", "email", "hashedPassword", "id", "inviteToken", "leftCompany", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
