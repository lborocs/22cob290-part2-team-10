/*
  Warnings:

  - Added the required column `deadline` to the `ProjectTask` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UserTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserTaskTag" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "_UserTaskToUserTaskTag" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserTaskToUserTaskTag_A_fkey" FOREIGN KEY ("A") REFERENCES "UserTask" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserTaskToUserTaskTag_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTaskTag" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "stage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "assigneeId" TEXT NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectTask" ("assigneeId", "description", "id", "projectId", "stage", "title") SELECT "assigneeId", "description", "id", "projectId", "stage", "title" FROM "ProjectTask";
DROP TABLE "ProjectTask";
ALTER TABLE "new_ProjectTask" RENAME TO "ProjectTask";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_UserTaskToUserTaskTag_AB_unique" ON "_UserTaskToUserTaskTag"("A", "B");

-- CreateIndex
CREATE INDEX "_UserTaskToUserTaskTag_B_index" ON "_UserTaskToUserTaskTag"("B");
