import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavingsGoalCommand } from './commands/create-savings-goal.command';
import { CreateSavingsGoalHandler } from './commands/create-savings-goal.handler';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { GetSavingsGoalsQueryDto } from './dto/get-savings-goals-query.dto';
import { SavingsGoalResponseDto } from './dto/savings-goal-response.dto';
import { SavingsGoalsListResponseDto } from './dto/savings-goals-list-response.dto';
import { GetSavingsGoalsHandler } from './queries/get-savings-goals.handler';
import { GetSavingsGoalsQuery } from './queries/get-savings-goals.query';

interface AuthenticatedRequest {
  user: { id: string; email: string };
}

@ApiTags('savings-goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('savings-goals')
export class SavingsGoalController {
  private readonly logger = new Logger(SavingsGoalController.name);

  constructor(
    private readonly createHandler: CreateSavingsGoalHandler,
    private readonly getSavingsGoalsHandler: GetSavingsGoalsHandler,
  ) {}

  @ApiOperation({ summary: 'List savings goals (paginated)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginated list of savings goals',
    type: SavingsGoalsListResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid token' })
  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetSavingsGoalsQueryDto,
  ): Promise<SavingsGoalsListResponseDto> {
    this.logger.log(`List savings goals request from user: ${req.user.id}`);
    return this.getSavingsGoalsHandler.execute(
      new GetSavingsGoalsQuery(req.user.id, query.pageNumber, query.pageSize),
    );
  }

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
