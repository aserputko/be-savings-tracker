import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavingsGoalCommand } from './commands/create-savings-goal.command';
import { CreateSavingsGoalHandler } from './commands/create-savings-goal.handler';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { SavingsGoalResponseDto } from './dto/savings-goal-response.dto';

interface AuthenticatedRequest {
  user: { id: string; email: string };
}

@ApiTags('savings-goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('savings-goals')
export class SavingsGoalController {
  private readonly logger = new Logger(SavingsGoalController.name);

  constructor(private readonly createHandler: CreateSavingsGoalHandler) {}

  @ApiOperation({ summary: 'Create a new savings goal' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Savings goal created successfully',
    type: SavingsGoalResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid token' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Validation failed' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateSavingsGoalDto,
  ): Promise<SavingsGoalResponseDto> {
    this.logger.log(`Create savings goal request from user: ${req.user.id}`);
    const result = await this.createHandler.execute(
      new CreateSavingsGoalCommand(req.user.id, dto.name, dto.targetAmount, dto.deadline),
    );
    this.logger.log(`Savings goal created: ${result.id}`);
    return result;
  }
}
