export class GetSavingsGoalsQuery {
  constructor(
    public readonly userId: string,
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
