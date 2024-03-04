import dayjs from 'dayjs/esm';

import { ISocialFeed, NewSocialFeed } from './social-feed.model';

export const sampleWithRequiredData: ISocialFeed = {
  id: 59935,
};

export const sampleWithPartialData: ISocialFeed = {
  id: 29240,
  lastUpdated: dayjs('2024-03-03T00:30'),
};

export const sampleWithFullData: ISocialFeed = {
  id: 24264,
  lastUpdated: dayjs('2024-03-02T23:56'),
};

export const sampleWithNewData: NewSocialFeed = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
