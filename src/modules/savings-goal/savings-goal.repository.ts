import { Injectable } from '@nestjs/common';
import { SavingsGoalModel } from '../../../generated/prisma/models/SavingsGoal';
import { PrismaService } from '../../prisma/prisma.service';
import { SavingsGoal } from './entities/savings-goal.entity';

export interface CreateSavingsGoalData {
  name: string;
  targetAmount: number;
  deadline?: string;
  userId: string;
}

export interface UpdateSavingsGoalData {
  name?: string;
  targetAmount?: number;
  deadline?: string | null;
}

@Injectable()
export class SavingsGoalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllPaginated(
    userId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ goals: SavingsGoal[]; total: number }> {
    const [records, total] = await Promise.all([
      this.prisma.savingsGoal.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.savingsGoal.count({ where: { userId } }),
    ]);
    return { goals: records.map((r) => this.toEntity(r)), total };
  }

  async findOne(id: string, userId: string): Promise<SavingsGoal | null> {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id, userId },
    });
    return goal ? this.toEntity(goal) : null;
  }

  async create(data: CreateSavingsGoalData): Promise<SavingsGoal> {
    const goal = await this.prisma.savingsGoal.create({
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        deadline: data.deadline ? new Date(data.deadline) : null,
        userId: data.userId,
      },
    });
    return this.toEntity(goal);
  }

  async update(id: string, userId: string, data: UpdateSavingsGoalData): Promise<SavingsGoal> {
    const goal = await this.prisma.savingsGoal.update({
      where: { id, userId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
        ...(data.deadline !== undefined && {
          deadline: data.deadline ? new Date(data.deadline) : null,
        }),
      },
    });
    return this.toEntity(goal);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.savingsGoal.delete({ where: { id, userId } });
  }

  private toEntity(record: SavingsGoalModel): SavingsGoal {
    const entity = new SavingsGoal();
    entity.id = record.id;
    entity.name = record.name;
    entity.targetAmount = Number(record.targetAmount);
    entity.deadline = record.deadline;
    entity.createdAt = record.createdAt;
    entity.updatedAt = record.updatedAt;
    entity.userId = record.userId;
    return entity;
  }
}
