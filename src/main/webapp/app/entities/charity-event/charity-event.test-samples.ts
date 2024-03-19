import dayjs from 'dayjs/esm';

import { ICharityEvent, NewCharityEvent } from './charity-event.model';

export const sampleWithRequiredData: ICharityEvent = {
  id: 71920,
};

export const sampleWithPartialData: ICharityEvent = {
  id: 11253,
  eventName: 'magnetic Maine',
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
};

export const sampleWithFullData: ICharityEvent = {
  id: 55217,
  eventName: 'HDD system',
  eventTimeDate: dayjs('2024-03-07T07:40'),
  description: '../fake-data/blob/hipster.txt',
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  duration: 25520,
};

export const sampleWithNewData: NewCharityEvent = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
