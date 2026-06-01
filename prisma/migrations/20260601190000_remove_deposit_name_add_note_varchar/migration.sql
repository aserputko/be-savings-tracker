-- AlterTable
ALTER TABLE "SavingsGoalDeposit" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "SavingsGoalDeposit" ALTER COLUMN "note" TYPE VARCHAR(256);
