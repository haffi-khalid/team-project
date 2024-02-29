import { IUserProfile, NewUserProfile } from './user-profile.model';

export const sampleWithRequiredData: IUserProfile = {
  id: 10373,
};

export const sampleWithPartialData: IUserProfile = {
  id: 71069,
  userName: '3rd deposit GB',
  role: 'vortals',
};

export const sampleWithFullData: IUserProfile = {
  id: 48154,
  userName: 'Chair Account',
  role: 'the',
};

export const sampleWithNewData: NewUserProfile = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
