import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SavingsGoalResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Emergency Fund' })
  name: string;

  @ApiProperty({ example: 5000.0 })
  targetAmount: number;

  @ApiProperty({ example: 250.0 })
  currentAmount: number;

  @ApiPropertyOptional({ example: '2027-12-31T00:00:00.000Z', nullable: true })
  deadline: Date | null;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  userId: string;
}
