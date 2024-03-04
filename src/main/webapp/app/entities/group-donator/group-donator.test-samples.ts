import { IGroupDonator, NewGroupDonator } from './group-donator.model';

export const sampleWithRequiredData: IGroupDonator = {
  id: 11781,
};

export const sampleWithPartialData: IGroupDonator = {
  id: 18141,
  groupname: 'engineer',
};

export const sampleWithFullData: IGroupDonator = {
  id: 45698,
  groupname: 'Loan',
  totalCollectedAmount: 29155,
};

export const sampleWithNewData: NewGroupDonator = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
