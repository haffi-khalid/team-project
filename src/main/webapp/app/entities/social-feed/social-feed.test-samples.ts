import dayjs from 'dayjs/esm';

import { ISocialFeed, NewSocialFeed } from './social-feed.model';

export const sampleWithRequiredData: ISocialFeed = {
  id: 59935,
  platform: 'user-facing Marketing',
};

export const sampleWithPartialData: ISocialFeed = {
  id: 19959,
  platform: 'local Baby',
  lastUpdated: dayjs('2024-02-27T06:04'),
};

export const sampleWithFullData: ISocialFeed = {
  id: 14932,
  platform: 'Solutions',
  lastUpdated: dayjs('2024-02-27T07:26'),
};

export const sampleWithNewData: NewSocialFeed = {
  platform: 'Utah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
