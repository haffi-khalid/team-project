import { LocationCategory } from 'app/entities/enumerations/location-category.model';

import { IFundraisingIdea, NewFundraisingIdea } from './fundraising-idea.model';

export const sampleWithRequiredData: IFundraisingIdea = {
  id: 1999,
};

export const sampleWithPartialData: IFundraisingIdea = {
  id: 54818,
  ideaName: 'Pennsylvania',
  ideaDescription: 'visualize user-centric Ameliorated',
};

export const sampleWithFullData: IFundraisingIdea = {
  id: 73196,
  ideaName: 'invoice Account',
  ideaDescription: 'salmon Optimized withdrawal',
  numberOfVolunteers: 38783,
  location: LocationCategory['INPERSON'],
  expectedCost: 28274,
  expectedAttendance: 40716,
};

export const sampleWithNewData: NewFundraisingIdea = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
