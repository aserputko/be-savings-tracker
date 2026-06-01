-- AlterTable
ALTER TABLE "SavingsGoal" ADD COLUMN     "currentAmount" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SavingsGoalDeposit" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "savingsGoalId" TEXT NOT NULL,

    CONSTRAINT "SavingsGoalDeposit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingsGoalDeposit" ADD CONSTRAINT "SavingsGoalDeposit_savingsGoalId_fkey" FOREIGN KEY ("savingsGoalId") REFERENCES "SavingsGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
