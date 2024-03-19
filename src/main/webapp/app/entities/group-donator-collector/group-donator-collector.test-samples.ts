import { IGroupDonatorCollector, NewGroupDonatorCollector } from './group-donator-collector.model';

export const sampleWithRequiredData: IGroupDonatorCollector = {
  id: 83925,
};

export const sampleWithPartialData: IGroupDonatorCollector = {
  id: 30112,
  donatorName: 'Reverse-engineered e-commerce',
  donationAmount: 66506,
};

export const sampleWithFullData: IGroupDonatorCollector = {
  id: 95389,
  donatorName: 'reboot',
  donationAmount: 38709,
};

export const sampleWithNewData: NewGroupDonatorCollector = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
