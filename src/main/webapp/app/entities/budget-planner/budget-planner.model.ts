export interface IBudgetPlanner {
  id: number;
  charityName?: string | null;
  totalBalance?: number | null;
  upcomingEvents?: string | null;
  targetAmount?: number | null;
  forecastIncome?: number | null;
}

export type NewBudgetPlanner = Omit<IBudgetPlanner, 'id'> & { id: null };
