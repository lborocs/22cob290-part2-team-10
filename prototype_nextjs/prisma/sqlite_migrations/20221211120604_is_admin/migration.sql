-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "leftCompany" BOOLEAN NOT NULL DEFAULT false,
    "inviteToken" TEXT,
    "avatarBg" TEXT NOT NULL DEFAULT '#e2ba39',
    "avatarFg" TEXT NOT NULL DEFAULT '#ffffff',
    "isManager" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("avatarBg", "avatarFg", "email", "hashedPassword", "id", "inviteToken", "isManager", "leftCompany", "name") SELECT "avatarBg", "avatarFg", "email", "hashedPassword", "id", "inviteToken", "isManager", "leftCompany", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
