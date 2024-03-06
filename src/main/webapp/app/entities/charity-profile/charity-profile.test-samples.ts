import { ICharityProfile, NewCharityProfile } from './charity-profile.model';

export const sampleWithRequiredData: ICharityProfile = {
  id: 79020,
};

export const sampleWithPartialData: ICharityProfile = {
  id: 45771,
  aim: 'payment parse Plastic',
  emailAddress: 'analyzing withdrawal',
  pictures: '../fake-data/blob/hipster.png',
  picturesContentType: 'unknown',
};

export const sampleWithFullData: ICharityProfile = {
  id: 43700,
  charityName: 'content Factors',
  purpose: 'white',
  aim: 'intuitive Avon methodical',
  emailAddress: 'scale',
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
