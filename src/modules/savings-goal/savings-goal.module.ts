import { Module } from '@nestjs/common';
import { AddDepositHandler } from './commands/add-deposit/add-deposit.handler';
import { CreateSavingsGoalHandler } from './commands/create-savings-goal/create-savings-goal.handler';
import { GetSavingsGoalsHandler } from './queries/get-savings-goals/get-savings-goals.handler';
import { SavingsGoalDepositRepository } from './repositories/savings-goal-deposit.repository';
import { SavingsGoalRepository } from './repositories/savings-goal.repository';
import { SavingsGoalController } from './savings-goal.controller';
import { SavingsGoalValidator } from './validators/savings-goal.validator';

@Module({
  controllers: [SavingsGoalController],
  providers: [
    SavingsGoalRepository,
    SavingsGoalDepositRepository,
    SavingsGoalValidator,
    CreateSavingsGoalHandler,
    GetSavingsGoalsHandler,
    AddDepositHandler,
  ],
})
export class SavingsGoalModule {}
