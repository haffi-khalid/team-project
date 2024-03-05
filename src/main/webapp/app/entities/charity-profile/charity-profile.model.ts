import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';

export interface ICharityProfile {
  id: number;
  charityName?: string | null;
  purpose?: string | null;
  aim?: string | null;
  emailAddress?: string | null;
  logo?: string | null;
  logoContentType?: string | null;
  pictures?: string | null;
  picturesContentType?: string | null;
  socialFeed?: Pick<ISocialFeed, 'id'> | null;
}

export type NewCharityProfile = Omit<ICharityProfile, 'id'> & { id: null };
