import { IUser } from 'app/entities/user/user.model';

export interface IUserPage {
  id: number;
  profilePicture?: string | null;
  profilePictureContentType?: string | null;
  name?: string | null;
  userBio?: string | null;
  volunteerHours?: number | null;
  reviewComment?: string | null;
  course?: string | null;
  skills?: string | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewUserPage = Omit<IUserPage, 'id'> & { id: null };
