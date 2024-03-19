import dayjs from 'dayjs/esm';

import { EventType } from 'app/entities/enumerations/event-type.model';

import { ICharityEvent, NewCharityEvent } from './charity-event.model';

export const sampleWithRequiredData: ICharityEvent = {
  id: 71920,
  location: 'Concrete transform magnetic',
  charityType: EventType['HEALTH'],
};

export const sampleWithPartialData: ICharityEvent = {
  id: 60043,
  description: '../fake-data/blob/hipster.txt',
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  duration: 48817,
  location: 'communities Enhanced TCP',
  charityType: EventType['HOMELESSNESS'],
};

export const sampleWithFullData: ICharityEvent = {
  id: 94999,
  eventName: 'Buckinghamshire',
  eventTimeDate: dayjs('2024-03-07T08:25'),
  description: '../fake-data/blob/hipster.txt',
  images: '../fake-data/blob/hipster.png',
  imagesContentType: 'unknown',
  duration: 82785,
  location: 'Fresh cohesive Bedfordshire',
  charityType: EventType['CHILDCARE'],
};

export const sampleWithNewData: NewCharityEvent = {
  location: 'Rupiah Wooden',
  charityType: EventType['CHILDCARE'],
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
