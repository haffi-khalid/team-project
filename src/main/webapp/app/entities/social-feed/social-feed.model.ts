import dayjs from 'dayjs/esm';
import { ICharity } from 'app/entities/charity/charity.model';

export interface ISocialFeed {
  id: number;
  platform?: string | null;
  lastUpdated?: dayjs.Dayjs | null;
  charity?: Pick<ICharity, 'id'> | null;
}

export type NewSocialFeed = Omit<ISocialFeed, 'id'> & { id: null };
