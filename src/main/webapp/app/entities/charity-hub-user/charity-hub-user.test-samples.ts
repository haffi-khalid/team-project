import { ICharityHubUser, NewCharityHubUser } from './charity-hub-user.model';

export const sampleWithRequiredData: ICharityHubUser = {
  id: 60835,
};

export const sampleWithPartialData: ICharityHubUser = {
  id: 24048,
};

export const sampleWithFullData: ICharityHubUser = {
  id: 55303,
  username: 'engineer',
  email: 'Trace.Hilll60@hotmail.com',
};

export const sampleWithNewData: NewCharityHubUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
