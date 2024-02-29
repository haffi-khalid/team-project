import { IPost } from 'app/entities/post/post.model';

export interface IMedia {
  id: number;
  type?: string | null;
  url?: string | null;
  post?: Pick<IPost, 'id'> | null;
}

export type NewMedia = Omit<IMedia, 'id'> & { id: null };
