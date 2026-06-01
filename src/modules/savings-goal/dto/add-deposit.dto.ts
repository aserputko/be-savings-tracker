import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';

export class AddDepositDto {
  @ApiProperty({ example: 'Monthly savings', description: 'Deposit name', maxLength: 256 })
  @IsString()
  @MaxLength(256)
  name: string;

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
