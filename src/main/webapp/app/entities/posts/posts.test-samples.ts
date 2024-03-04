import dayjs from 'dayjs/esm';

import { IPosts, NewPosts } from './posts.model';

export const sampleWithRequiredData: IPosts = {
  id: 7346,
};

export const sampleWithPartialData: IPosts = {
  id: 48304,
  content: 'Outdoors Dynamic state',
  timestamp: dayjs('2024-03-03T10:18'),
};

export const sampleWithFullData: IPosts = {
  id: 64977,
  content: 'Facilitator Franc',
  timestamp: dayjs('2024-03-02T23:11'),
};

export const sampleWithNewData: NewPosts = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
