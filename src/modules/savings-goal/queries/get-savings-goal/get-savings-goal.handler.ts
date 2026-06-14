import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SavingsGoalResponseDto } from '../../dto/savings-goal-response.dto';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { GetSavingsGoalQuery } from './get-savings-goal.query';

@Injectable()
export class GetSavingsGoalHandler {
  private readonly logger = new Logger(GetSavingsGoalHandler.name);

  constructor(private readonly savingsGoalRepository: SavingsGoalRepository) {}

  async execute(query: GetSavingsGoalQuery): Promise<SavingsGoalResponseDto> {
    this.logger.debug(`Fetching savings goal ${query.id} for user: ${query.userId}`);

    const goal = await this.savingsGoalRepository.findOne(query.id, query.userId);

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    this.logger.log(`Returning savings goal ${query.id} for user: ${query.userId}`);

    return goal;
  }
}
