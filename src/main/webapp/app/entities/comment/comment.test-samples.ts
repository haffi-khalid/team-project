import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 78899,
};

export const sampleWithPartialData: IComment = {
  id: 78272,
  content: 'Alabama Customer',
};

export const sampleWithFullData: IComment = {
  id: 42730,
  parentID: 2467,
  content: 'repurpose deposit',
  timeStamp: dayjs('2024-02-27T20:22'),
  status: 'pixel interactive Frozen',
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
