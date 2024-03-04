import dayjs from 'dayjs/esm';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';

export interface IPosts {
  id: number;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
  socialFeed?: Pick<ISocialFeed, 'id'> | null;
}

export type NewPosts = Omit<IPosts, 'id'> & { id: null };
