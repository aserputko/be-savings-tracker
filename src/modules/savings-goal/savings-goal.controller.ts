import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddDepositCommand } from './commands/add-deposit/add-deposit.command';
import { AddDepositHandler } from './commands/add-deposit/add-deposit.handler';
import { CreateSavingsGoalCommand } from './commands/create-savings-goal/create-savings-goal.command';
import { CreateSavingsGoalHandler } from './commands/create-savings-goal/create-savings-goal.handler';
import { AddDepositDto } from './dto/add-deposit.dto';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { GetSavingsGoalsQueryDto } from './dto/get-savings-goals-query.dto';
import { SavingsGoalDepositResponseDto } from './dto/savings-goal-deposit-response.dto';
import { SavingsGoalResponseDto } from './dto/savings-goal-response.dto';
import { SavingsGoalsListResponseDto } from './dto/savings-goals-list-response.dto';
import { GetSavingsGoalsHandler } from './queries/get-savings-goals/get-savings-goals.handler';
import { GetSavingsGoalsQuery } from './queries/get-savings-goals/get-savings-goals.query';

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
    private readonly addDepositHandler: AddDepositHandler,
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

  @ApiOperation({ summary: 'Add a deposit to a savings goal' })
  @ApiParam({ name: 'id', description: 'Savings goal ID' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deposit added successfully',
    type: SavingsGoalDepositResponseDto,
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Missing or invalid token' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Savings goal not found' })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Validation failed' })
  @Post(':id/deposits')
  @HttpCode(HttpStatus.CREATED)
  async addDeposit(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: AddDepositDto,
  ): Promise<SavingsGoalDepositResponseDto> {
    this.logger.log(`Add deposit to goal ${id} from user: ${req.user.id}`);
    const result = await this.addDepositHandler.execute(
      new AddDepositCommand(req.user.id, id, dto.amount, dto.note),
    );
    this.logger.log(`Deposit added: ${result.id} to goal: ${id}`);
    return result;
  }
}
