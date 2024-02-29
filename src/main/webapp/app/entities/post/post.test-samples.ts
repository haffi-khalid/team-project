import dayjs from 'dayjs/esm';

import { IPost, NewPost } from './post.model';

export const sampleWithRequiredData: IPost = {
  id: 35989,
};

export const sampleWithPartialData: IPost = {
  id: 59985,
};

export const sampleWithFullData: IPost = {
  id: 93202,
  content: 'Seychelles',
  timestamp: dayjs('2024-02-27T02:32'),
  likes: 23240,
  shares: 75723,
};

export const sampleWithNewData: NewPost = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
