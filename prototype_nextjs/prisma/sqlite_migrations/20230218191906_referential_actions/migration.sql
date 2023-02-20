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
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectTask" ("assigneeId", "deadline", "description", "id", "projectId", "stage", "title") SELECT "assigneeId", "deadline", "description", "id", "projectId", "stage", "title" FROM "ProjectTask";
DROP TABLE "ProjectTask";
ALTER TABLE "new_ProjectTask" RENAME TO "ProjectTask";
CREATE TABLE "new_PostHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "editorId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PostHistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostHistory_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostHistory" ("content", "date", "editorId", "id", "postId", "summary", "title") SELECT "content", "date", "editorId", "id", "postId", "summary", "title" FROM "PostHistory";
DROP TABLE "PostHistory";
ALTER TABLE "new_PostHistory" RENAME TO "PostHistory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
