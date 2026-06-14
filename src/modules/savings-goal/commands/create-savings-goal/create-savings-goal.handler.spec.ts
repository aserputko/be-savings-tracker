import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SavingsGoal } from '../../entities/savings-goal.entity';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { SavingsGoalValidator } from '../../validators/savings-goal.validator';
import { CreateSavingsGoalCommand } from './create-savings-goal.command';
import { CreateSavingsGoalHandler } from './create-savings-goal.handler';

jest.mock('../../repositories/savings-goal.repository', () => ({
  SavingsGoalRepository: jest.fn(),
}));

describe('CreateSavingsGoalHandler', () => {
  let handler: CreateSavingsGoalHandler;
  let repository: jest.Mocked<SavingsGoalRepository>;

  const mockGoal: SavingsGoal = {
    id: 'goal-id-1',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 0,
    deadline: new Date('2026-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-id-1',
  };

  beforeEach(async () => {
    const mockRepository: jest.Mocked<Partial<SavingsGoalRepository>> = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSavingsGoalHandler,
        SavingsGoalValidator,
        { provide: SavingsGoalRepository, useValue: mockRepository },
      ],
    }).compile();

    handler = module.get<CreateSavingsGoalHandler>(CreateSavingsGoalHandler);
    repository = module.get(SavingsGoalRepository);
  });

  it('should create a savings goal successfully', async () => {
    repository.create.mockResolvedValue(mockGoal);

    const command = new CreateSavingsGoalCommand('user-id-1', 'Emergency Fund', 5000, '2026-12-31');

    const result = await handler.execute(command);

    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Emergency Fund',
      targetAmount: 5000,
      deadline: '2026-12-31',
      userId: 'user-id-1',
    });
    expect(result).toEqual(mockGoal);
  });

  it('should throw BadRequestException when name exceeds 256 characters', async () => {
    const longName = 'a'.repeat(257);
    const command = new CreateSavingsGoalCommand('user-id-1', longName, 5000, '2026-12-31');

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(command)).rejects.toThrow(
      'Savings goal name must not exceed 256 characters',
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when target amount is zero or negative', async () => {
    const zeroCommand = new CreateSavingsGoalCommand(
      'user-id-1',
      'Emergency Fund',
      0,
      '2026-12-31',
    );
    const negativeCommand = new CreateSavingsGoalCommand(
      'user-id-1',
      'Emergency Fund',
      -100,
      '2026-12-31',
    );

    await expect(handler.execute(zeroCommand)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(zeroCommand)).rejects.toThrow(
      'Target amount must be a positive number',
    );
    await expect(handler.execute(negativeCommand)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(negativeCommand)).rejects.toThrow(
      'Target amount must be a positive number',
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when deadline is in the past', async () => {
    const command = new CreateSavingsGoalCommand('user-id-1', 'Emergency Fund', 5000, '2020-01-01');

    await expect(handler.execute(command)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(command)).rejects.toThrow('Deadline must not be in the past');
    expect(repository.create).not.toHaveBeenCalled();
  });
});
