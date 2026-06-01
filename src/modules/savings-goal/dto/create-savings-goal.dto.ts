import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateSavingsGoalDto {
  @ApiProperty({ example: 'Emergency Fund', description: 'Goal name', maxLength: 256 })
  @IsString()
  @MaxLength(256)
  name: string;

  @ApiProperty({
    example: 5000.0,
    description: 'Target amount (positive number, max 9999999999999)',
    maximum: 9999999999999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(9999999999999)
  targetAmount: number;

  @ApiPropertyOptional({
    example: '2027-12-31',
    description: 'Optional deadline (ISO 8601 date string)',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
