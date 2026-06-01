import { Injectable, Logger } from '@nestjs/common';
import { SavingsGoalsListResponseDto } from '../../dto/savings-goals-list-response.dto';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { GetSavingsGoalsQuery } from './get-savings-goals.query';

@Injectable()
export class GetSavingsGoalsHandler {
  private readonly logger = new Logger(GetSavingsGoalsHandler.name);

  constructor(private readonly savingsGoalRepository: SavingsGoalRepository) {}

  async execute(query: GetSavingsGoalsQuery): Promise<SavingsGoalsListResponseDto> {
    this.logger.debug(
      `Fetching savings goals for user: ${query.userId} (page ${query.pageNumber}, size ${query.pageSize})`,
    );

    const { goals, total } = await this.savingsGoalRepository.findAllPaginated(
      query.userId,
      query.pageNumber,
      query.pageSize,
    );

    this.logger.log(
      `Returning ${goals.length} of ${total} savings goals for user: ${query.userId}`,
    );

    return {
      data: goals,
      pagination: {
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        total,
      },
    };
  }
}
