import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SavingsGoalDeposit } from '../../entities/savings-goal-deposit.entity';
import { SavingsGoal } from '../../entities/savings-goal.entity';
import { SavingsGoalDepositRepository } from '../../repositories/savings-goal-deposit.repository';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { SavingsGoalValidator } from '../../validators/savings-goal.validator';
import { AddDepositCommand } from './add-deposit.command';
import { AddDepositHandler } from './add-deposit.handler';

jest.mock('../savings-goal.repository', () => ({
  SavingsGoalRepository: jest.fn(),
}));

jest.mock('../repositories/savings-goal-deposit.repository', () => ({
  SavingsGoalDepositRepository: jest.fn(),
}));

describe('AddDepositHandler', () => {
  let handler: AddDepositHandler;
  let savingsGoalRepository: jest.Mocked<SavingsGoalRepository>;
  let depositRepository: jest.Mocked<SavingsGoalDepositRepository>;

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

  const mockDeposit: SavingsGoalDeposit = {
    id: 'deposit-id-1',
    savingsGoalId: 'goal-id-1',
    amount: 200,
    note: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockSavingsGoalRepository: jest.Mocked<Partial<SavingsGoalRepository>> = {
      findOne: jest.fn(),
    };

    const mockDepositRepository: jest.Mocked<Partial<SavingsGoalDepositRepository>> = {
      createDepositAndUpdateGoal: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddDepositHandler,
        SavingsGoalValidator,
        { provide: SavingsGoalRepository, useValue: mockSavingsGoalRepository },
        { provide: SavingsGoalDepositRepository, useValue: mockDepositRepository },
      ],
    }).compile();

    handler = module.get<AddDepositHandler>(AddDepositHandler);
    savingsGoalRepository = module.get(SavingsGoalRepository);
    depositRepository = module.get(SavingsGoalDepositRepository);
  });

  it('should add a deposit successfully', async () => {
    savingsGoalRepository.findOne.mockResolvedValue(mockGoal);
    depositRepository.createDepositAndUpdateGoal.mockResolvedValue(mockDeposit);

    const command = new AddDepositCommand('user-id-1', 'goal-id-1', 200);

    const result = await handler.execute(command);

    expect(savingsGoalRepository.findOne).toHaveBeenCalledWith('goal-id-1', 'user-id-1');
    expect(depositRepository.createDepositAndUpdateGoal).toHaveBeenCalledWith({
      savingsGoalId: 'goal-id-1',
      amount: 200,
      note: undefined,
    });
    expect(result).toEqual(mockDeposit);
  });

  it('should throw BadRequestException when deposit amount is zero or negative', async () => {
    const zeroCommand = new AddDepositCommand('user-id-1', 'goal-id-1', 0);
    const negativeCommand = new AddDepositCommand('user-id-1', 'goal-id-1', -100);

    await expect(handler.execute(zeroCommand)).rejects.toThrow(BadRequestException);
    await expect(handler.execute(zeroCommand)).rejects.toThrow(
      'Deposit amount must be a positive number',
    );
    await expect(handler.execute(negativeCommand)).rejects.toThrow(BadRequestException);
    expect(depositRepository.createDepositAndUpdateGoal).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when savings goal does not exist', async () => {
    savingsGoalRepository.findOne.mockResolvedValue(null);
    const command = new AddDepositCommand('user-id-1', 'nonexistent-goal', 200);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(command)).rejects.toThrow('Savings goal not found');
    expect(depositRepository.createDepositAndUpdateGoal).not.toHaveBeenCalled();
  });
});
