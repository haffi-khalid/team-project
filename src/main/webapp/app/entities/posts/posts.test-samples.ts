import dayjs from 'dayjs/esm';

import { IPosts, NewPosts } from './posts.model';

export const sampleWithRequiredData: IPosts = {
  id: 7346,
};

export const sampleWithPartialData: IPosts = {
  id: 48304,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-06T14:27'),
};

export const sampleWithFullData: IPosts = {
  id: 2392,
  content: '../fake-data/blob/hipster.txt',
  timestamp: dayjs('2024-03-06T15:35'),
};

export const sampleWithNewData: NewPosts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
