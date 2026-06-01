import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class SavingsGoalValidator {
  validateName(name: string): void {
    if (name.length > 256) {
      throw new BadRequestException('Savings goal name must not exceed 256 characters');
    }
  }

  validateTargetAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Target amount must be a positive number');
    }
  }

  validateDepositAmount(amount: number): void {
    if (amount <= 0) {
      throw new BadRequestException('Deposit amount must be a positive number');
    }
  }

  validateDeadline(deadline?: string | Date): void {
    if (deadline === undefined || deadline === null) {
      return;
    }

    const deadlineDate = new Date(deadline);
    deadlineDate.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (deadlineDate < today) {
      throw new BadRequestException('Deadline must not be in the past');
    }
  }
}
