export class GetSavingsGoalQuery {
  constructor(
    public readonly userId: string,
    public readonly id: string,
  ) {}
}
