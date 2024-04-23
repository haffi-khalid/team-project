import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { ICharityEvent } from 'app/entities/charity-event/charity-event.model';

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
  photos?: string | null;
  photosContentType?: string | null;
  recentActivityPhotos?: string | null;
  numberOfVolunteers?: number | null;
  numberOfDonators?: number | null;
  socialFeed?: Pick<ISocialFeed, 'id'> | null;
  charityEvent?: Pick<ICharityEvent, 'id' | 'imagesContentType' | 'images' | 'eventName'> | null;
}

export type NewCharityProfile = Omit<ICharityProfile, 'id'> & { id: null };
