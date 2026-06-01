import { Module } from '@nestjs/common';
import { CreateSavingsGoalHandler } from './commands/create-savings-goal.handler';
import { SavingsGoalController } from './savings-goal.controller';
import { SavingsGoalRepository } from './savings-goal.repository';

@Module({
  controllers: [SavingsGoalController],
  providers: [SavingsGoalRepository, CreateSavingsGoalHandler],
})
export class SavingsGoalModule {}
