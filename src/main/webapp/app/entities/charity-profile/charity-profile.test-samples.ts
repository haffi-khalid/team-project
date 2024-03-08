import { ICharityProfile, NewCharityProfile } from './charity-profile.model';

export const sampleWithRequiredData: ICharityProfile = {
  id: 79020,
};

export const sampleWithPartialData: ICharityProfile = {
  id: 45771,
  aim: '../fake-data/blob/hipster.txt',
  emailAddress: 'payment parse Plastic',
  pictures: '../fake-data/blob/hipster.png',
  picturesContentType: 'unknown',
};

export const sampleWithFullData: ICharityProfile = {
  id: 50517,
  charityName: 'Rustic',
  purpose: '../fake-data/blob/hipster.txt',
  aim: '../fake-data/blob/hipster.txt',
  emailAddress: 'redundant',
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  pictures: '../fake-data/blob/hipster.png',
  picturesContentType: 'unknown',
};

export const sampleWithNewData: NewCharityProfile = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
