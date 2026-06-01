import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SavingsGoalDepositResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  savingsGoalId: string;

  @ApiProperty({ example: 200.0 })
  amount: number;

  @ApiPropertyOptional({ example: 'Bonus from work', nullable: true })
  note: string | null;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
  updatedAt: Date;
}
