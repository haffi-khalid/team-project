import dayjs from 'dayjs/esm';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';

export interface IPost {
  id: number;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
  likes?: number | null;
  shares?: number | null;
  socialFeed?: Pick<ISocialFeed, 'id'> | null;
}

export type NewPost = Omit<IPost, 'id'> & { id: null };
