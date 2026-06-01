import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';

export class AddDepositDto {
  @ApiProperty({
    example: 200.0,
    description: 'Deposit amount (positive number, max 9999999999999)',
    maximum: 9999999999999,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(9999999999999)
  amount: number;

  @ApiPropertyOptional({ example: 'Bonus from work', description: 'Optional note' })
  @IsOptional()
  @IsString()
  note?: string;
}
