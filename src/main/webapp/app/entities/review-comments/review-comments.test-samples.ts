import dayjs from 'dayjs/esm';

import { IReviewComments, NewReviewComments } from './review-comments.model';

export const sampleWithRequiredData: IReviewComments = {
  id: 3391,
};

export const sampleWithPartialData: IReviewComments = {
  id: 72405,
  timestamp: dayjs('2024-03-07T03:45'),
  status: 'Computer',
  likeCount: 65201,
};

export const sampleWithFullData: IReviewComments = {
  id: 1553,
  parentID: 51064,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-07T11:45'),
  status: 'Personal Fantastic Towels',
  likeCount: 68858,
};

export const sampleWithNewData: NewReviewComments = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
