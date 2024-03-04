import { IBudgetPlanner, NewBudgetPlanner } from './budget-planner.model';

export const sampleWithRequiredData: IBudgetPlanner = {
  id: 27768,
};

export const sampleWithPartialData: IBudgetPlanner = {
  id: 48856,
  charityName: 'infrastructures Landing compressing',
  totalBalance: 72718,
  targetAmount: 3443,
  forecastIncome: 93069,
};

export const sampleWithFullData: IBudgetPlanner = {
  id: 29486,
  charityName: 'vertical GB',
  totalBalance: 74686,
  upcomingEvents: 'Awesome Developer Mews',
  targetAmount: 44031,
  forecastIncome: 67720,
};

export const sampleWithNewData: NewBudgetPlanner = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
