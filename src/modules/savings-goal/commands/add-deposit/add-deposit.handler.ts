import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SavingsGoalDepositResponseDto } from '../../dto/savings-goal-deposit-response.dto';
import { SavingsGoalDepositRepository } from '../../repositories/savings-goal-deposit.repository';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { SavingsGoalValidator } from '../../validators/savings-goal.validator';
import { AddDepositCommand } from './add-deposit.command';

@Injectable()
export class AddDepositHandler {
  private readonly logger = new Logger(AddDepositHandler.name);

  constructor(
    private readonly savingsGoalRepository: SavingsGoalRepository,
    private readonly depositRepository: SavingsGoalDepositRepository,
    private readonly validator: SavingsGoalValidator,
  ) {}

  async execute(command: AddDepositCommand): Promise<SavingsGoalDepositResponseDto> {
    this.logger.debug(
      `Adding deposit "${command.name}" to goal: ${command.savingsGoalId} for user: ${command.userId}`,
    );

    this.validator.validateName(command.name);
    this.validator.validateDepositAmount(command.amount);

    const goal = await this.savingsGoalRepository.findOne(command.savingsGoalId, command.userId);
    if (!goal) {
      throw new NotFoundException(`Savings goal not found`);
    }

    const deposit = await this.depositRepository.createDepositAndUpdateGoal({
      savingsGoalId: command.savingsGoalId,
      name: command.name,
      amount: command.amount,
      note: command.note,
    });

    this.logger.log(`Deposit created: ${deposit.id} for goal: ${command.savingsGoalId}`);

    return deposit;
  }
}
