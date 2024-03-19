import dayjs from 'dayjs/esm';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface IReviewComments {
  id: number;
  parentID?: number | null;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
  status?: string | null;
  likeCount?: number | null;
  userPage?: Pick<IUserPage, 'id' | 'user'> | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewReviewComments = Omit<IReviewComments, 'id'> & { id: null };
