import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SavingsGoalDeposit } from '../entities/savings-goal-deposit.entity';

export interface CreateDepositData {
  savingsGoalId: string;
  amount: number;
  note?: string;
}

@Injectable()
export class SavingsGoalDepositRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDepositAndUpdateGoal(data: CreateDepositData): Promise<SavingsGoalDeposit> {
    return this.prisma.$transaction(async (tx: PrismaClient) => {
      const deposit = await tx.savingsGoalDeposit.create({
        data: {
          amount: data.amount,
          note: data.note ?? null,
          savingsGoalId: data.savingsGoalId,
        },
      });

      await tx.savingsGoal.update({
        where: { id: data.savingsGoalId },
        data: { currentAmount: { increment: data.amount } },
      });

      return this.toEntity(deposit);
    });
  }

  private toEntity(record: {
    id: string;
    savingsGoalId: string;
    amount: { toNumber(): number } | number;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): SavingsGoalDeposit {
    const entity = new SavingsGoalDeposit();
    entity.id = record.id;
    entity.savingsGoalId = record.savingsGoalId;
    entity.amount = typeof record.amount === 'object' ? record.amount.toNumber() : record.amount;
    entity.note = record.note;
    entity.createdAt = record.createdAt;
    entity.updatedAt = record.updatedAt;
    return entity;
  }
}
