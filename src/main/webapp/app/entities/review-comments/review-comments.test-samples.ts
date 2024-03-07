import dayjs from 'dayjs/esm';

import { IReviewComments, NewReviewComments } from './review-comments.model';

export const sampleWithRequiredData: IReviewComments = {
  id: 3391,
};

export const sampleWithPartialData: IReviewComments = {
  id: 90107,
  timestamp: dayjs('2024-03-06T19:41'),
  status: 'Keyboard Profound',
};

export const sampleWithFullData: IReviewComments = {
  id: 51064,
  parentID: 5477,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-06T13:57'),
  status: 'SQL facilitate',
};

export const sampleWithNewData: NewReviewComments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
