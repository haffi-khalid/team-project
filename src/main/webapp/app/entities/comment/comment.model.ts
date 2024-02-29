import dayjs from 'dayjs/esm';
import { ICharity } from 'app/entities/charity/charity.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';

export interface IComment {
  id: number;
  parentID?: number | null;
  content?: string | null;
  timeStamp?: dayjs.Dayjs | null;
  status?: string | null;
  charityID?: Pick<ICharity, 'id'> | null;
  userProfile?: Pick<IUserProfile, 'id'> | null;
  commentID?: Pick<IComment, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
