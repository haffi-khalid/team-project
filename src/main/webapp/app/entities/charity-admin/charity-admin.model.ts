import { IBudgetPlanner } from 'app/entities/budget-planner/budget-planner.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface ICharityAdmin {
  id: number;
  isCharityAdmin?: boolean | null;
  budgetPlanner?: Pick<IBudgetPlanner, 'id'> | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewCharityAdmin = Omit<ICharityAdmin, 'id'> & { id: null };
