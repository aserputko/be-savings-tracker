import { ApiProperty } from '@nestjs/swagger';
import { SavingsGoalResponseDto } from './savings-goal-response.dto';

export class PaginationDto {
  @ApiProperty({ example: 1 })
  pageNumber: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}

export class SavingsGoalsListResponseDto {
  @ApiProperty({ type: [SavingsGoalResponseDto] })
  data: SavingsGoalResponseDto[];

  @ApiProperty({ type: PaginationDto })
  pagination: PaginationDto;
}
