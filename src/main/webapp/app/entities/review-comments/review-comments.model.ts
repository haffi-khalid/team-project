import dayjs from 'dayjs/esm';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface IReviewComments {
  id: number;
  parentID?: number | null;
  content?: string | null;
  timestamp?: dayjs.Dayjs | null;
  status?: string | null;
  charityHubUser?: Pick<ICharityHubUser, 'id' | 'username'> | null;
  charityProfile?: Pick<ICharityProfile, 'id'> | null;
}

export type NewReviewComments = Omit<IReviewComments, 'id'> & { id: null };
