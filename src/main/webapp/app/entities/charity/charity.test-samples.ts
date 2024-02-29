import { ICharity, NewCharity } from './charity.model';

export const sampleWithRequiredData: ICharity = {
  id: 24923,
};

export const sampleWithPartialData: ICharity = {
  id: 41511,
};

export const sampleWithFullData: ICharity = {
  id: 20989,
  name: 'feed data-warehouse Washington',
};

export const sampleWithNewData: NewCharity = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
