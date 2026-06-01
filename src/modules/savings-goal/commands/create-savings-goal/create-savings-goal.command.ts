export class CreateSavingsGoalCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly targetAmount: number,
    public readonly deadline?: string,
  ) {}
}
