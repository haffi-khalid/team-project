import dayjs from 'dayjs/esm';

export interface ISocialFeed {
  id: number;
  lastUpdated?: dayjs.Dayjs | null;
}

export type NewSocialFeed = Omit<ISocialFeed, 'id'> & { id: null };
