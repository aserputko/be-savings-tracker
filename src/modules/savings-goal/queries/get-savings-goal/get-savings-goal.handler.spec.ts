import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SavingsGoal } from '../../entities/savings-goal.entity';
import { SavingsGoalRepository } from '../../repositories/savings-goal.repository';
import { GetSavingsGoalHandler } from './get-savings-goal.handler';
import { GetSavingsGoalQuery } from './get-savings-goal.query';

jest.mock('../../repositories/savings-goal.repository', () => ({
  SavingsGoalRepository: jest.fn(),
}));

describe('GetSavingsGoalHandler', () => {
  let handler: GetSavingsGoalHandler;
  let savingsGoalRepository: jest.Mocked<SavingsGoalRepository>;

  const mockGoal: SavingsGoal = {
    id: 'goal-id-1',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 250,
    deadline: new Date('2027-12-31'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user-id-1',
  };

  beforeEach(async () => {
    const mockSavingsGoalRepository: jest.Mocked<Partial<SavingsGoalRepository>> = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSavingsGoalHandler,
        { provide: SavingsGoalRepository, useValue: mockSavingsGoalRepository },
      ],
    }).compile();

    handler = module.get<GetSavingsGoalHandler>(GetSavingsGoalHandler);
    savingsGoalRepository = module.get(SavingsGoalRepository);
  });

  it('should return a savings goal when found', async () => {
    savingsGoalRepository.findOne.mockResolvedValue(mockGoal);
    const query = new GetSavingsGoalQuery('user-id-1', 'goal-id-1');

    const result = await handler.execute(query);

    expect(savingsGoalRepository.findOne).toHaveBeenCalledWith('goal-id-1', 'user-id-1');
    expect(result).toEqual(mockGoal);
  });

  it('should throw NotFoundException when savings goal does not exist', async () => {
    savingsGoalRepository.findOne.mockResolvedValue(null);
    const query = new GetSavingsGoalQuery('user-id-1', 'nonexistent-goal');

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(query)).rejects.toThrow('Savings goal not found');
  });

  it('should throw NotFoundException when savings goal belongs to another user', async () => {
    savingsGoalRepository.findOne.mockResolvedValue(null);
    const query = new GetSavingsGoalQuery('other-user-id', 'goal-id-1');

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
    await expect(handler.execute(query)).rejects.toThrow('Savings goal not found');
    expect(savingsGoalRepository.findOne).toHaveBeenCalledWith('goal-id-1', 'other-user-id');
  });
});
