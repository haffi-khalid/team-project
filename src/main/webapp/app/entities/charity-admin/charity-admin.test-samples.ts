import { ICharityAdmin, NewCharityAdmin } from './charity-admin.model';

export const sampleWithRequiredData: ICharityAdmin = {
  id: 66033,
};

export const sampleWithPartialData: ICharityAdmin = {
  id: 27669,
  isCharityAdmin: false,
};

export const sampleWithFullData: ICharityAdmin = {
  id: 25342,
  isCharityAdmin: true,
};

export const sampleWithNewData: NewCharityAdmin = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
