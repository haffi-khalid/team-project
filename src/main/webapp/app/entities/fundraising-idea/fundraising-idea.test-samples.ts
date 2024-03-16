import { LocationCategory } from 'app/entities/enumerations/location-category.model';

import { IFundraisingIdea, NewFundraisingIdea } from './fundraising-idea.model';

export const sampleWithRequiredData: IFundraisingIdea = {
  id: 1999,
};

export const sampleWithPartialData: IFundraisingIdea = {
  id: 54818,
  ideaName: 'Pennsylvania',
  ideaDescription: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IFundraisingIdea = {
  id: 78762,
  ideaName: 'Islands CSS',
  ideaDescription: '../fake-data/blob/hipster.txt',
  numberOfVolunteers: 2747,
  location: LocationCategory['INPERSON'],
  expectedCost: 73196,
  expectedAttendance: 39803,
};

export const sampleWithNewData: NewFundraisingIdea = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
