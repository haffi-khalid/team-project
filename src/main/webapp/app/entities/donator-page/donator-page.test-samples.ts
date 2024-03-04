import { IDonatorPage, NewDonatorPage } from './donator-page.model';

export const sampleWithRequiredData: IDonatorPage = {
  id: 38424,
};

export const sampleWithPartialData: IDonatorPage = {
  id: 93110,
  name: 'synthesize',
  amount: 40295,
};

export const sampleWithFullData: IDonatorPage = {
  id: 45339,
  name: 'proactive Dynamic',
  anonymous: false,
  amount: 36102,
  groupDonation: false,
};

export const sampleWithNewData: NewDonatorPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
