-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetDate" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "accountUsername" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
