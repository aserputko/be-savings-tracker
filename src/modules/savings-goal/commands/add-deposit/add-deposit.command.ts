export class AddDepositCommand {
  constructor(
    public readonly userId: string,
    public readonly savingsGoalId: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly note?: string,
  ) {}
}
