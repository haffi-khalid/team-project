import dayjs from 'dayjs/esm';

import { IReviewComments, NewReviewComments } from './review-comments.model';

export const sampleWithRequiredData: IReviewComments = {
  id: 3391,
};

export const sampleWithPartialData: IReviewComments = {
  id: 90107,
  timestamp: dayjs('2024-03-05T00:17'),
  status: 'Keyboard Profound',
};

export const sampleWithFullData: IReviewComments = {
  id: 51064,
  parentID: 5477,
  content: 'Personal Fantastic Towels',
  timestamp: dayjs('2024-03-05T01:09'),
  status: 'benchmark users synthesizing',
};

export const sampleWithNewData: NewReviewComments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
