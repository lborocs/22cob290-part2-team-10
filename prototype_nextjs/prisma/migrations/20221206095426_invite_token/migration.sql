/*
  Warnings:

  - You are about to drop the column `inviterId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "leftCompany" BOOLEAN NOT NULL DEFAULT false,
    "inviteToken" TEXT,
    "avatarBg" TEXT NOT NULL DEFAULT '#e2ba39',
    "avatarFg" TEXT NOT NULL DEFAULT '#ffffff'
);
INSERT INTO "new_User" ("avatarBg", "avatarFg", "email", "hashedPassword", "id", "leftCompany", "name") SELECT "avatarBg", "avatarFg", "email", "hashedPassword", "id", "leftCompany", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
