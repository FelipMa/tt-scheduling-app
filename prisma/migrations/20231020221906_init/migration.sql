-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "targetDate" TEXT NOT NULL,
    "accountUsername" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
