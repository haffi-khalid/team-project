import { ICharityHubUser, NewCharityHubUser } from './charity-hub-user.model';

export const sampleWithRequiredData: ICharityHubUser = {
  id: 60835,
};

export const sampleWithPartialData: ICharityHubUser = {
  id: 55303,
};

export const sampleWithFullData: ICharityHubUser = {
  id: 14139,
  username: 'auxiliary Identity',
  email: 'Layla_Mante31@gmail.com',
  password: 'SSL Direct',
};

export const sampleWithNewData: NewCharityHubUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
