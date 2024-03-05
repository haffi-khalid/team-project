import dayjs from 'dayjs/esm';

import { IPosts, NewPosts } from './posts.model';

export const sampleWithRequiredData: IPosts = {
  id: 7346,
};

export const sampleWithPartialData: IPosts = {
  id: 48304,
  content: 'Outdoors Dynamic state',
  timestamp: dayjs('2024-03-05T05:02'),
};

export const sampleWithFullData: IPosts = {
  id: 64977,
  content: 'Facilitator Franc',
  timestamp: dayjs('2024-03-04T17:55'),
};

export const sampleWithNewData: NewPosts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
