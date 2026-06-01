import { Injectable, Logger } from '@nestjs/common';
import { SavingsGoalResponseDto } from '../../dto/savings-goal-response.dto';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { SavingsGoalValidator } from '../../validators/savings-goal.validator';
import { CreateSavingsGoalCommand } from './create-savings-goal.command';

@Injectable()
export class CreateSavingsGoalHandler {
  private readonly logger = new Logger(CreateSavingsGoalHandler.name);

  constructor(
    private readonly savingsGoalRepository: SavingsGoalRepository,
    private readonly validator: SavingsGoalValidator,
  ) {}

  async execute(command: CreateSavingsGoalCommand): Promise<SavingsGoalResponseDto> {
    this.logger.debug(`Creating savings goal "${command.name}" for user: ${command.userId}`);

    this.validator.validateName(command.name);
    this.validator.validateTargetAmount(command.targetAmount);
    this.validator.validateDeadline(command.deadline);

    const goal = await this.savingsGoalRepository.create({
      name: command.name,
      targetAmount: command.targetAmount,
      deadline: command.deadline,
      userId: command.userId,
    });

    this.logger.log(`Savings goal created with id: ${goal.id} for user: ${command.userId}`);

    return goal;
  }
}
