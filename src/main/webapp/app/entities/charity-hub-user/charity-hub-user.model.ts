import { IUser } from 'app/entities/user/user.model';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { IAuthentication } from 'app/entities/authentication/authentication.model';

export interface ICharityHubUser {
  id: number;
  username?: string | null;
  email?: string | null;
  volunteerHours?: number | null; // Optional integer field for volunteer hours
  userBio?: string | null; // Optional string for user biography
  reviewComment?: string | null; // Optional string for review comments
  course?: string | null; // Optional string for course
  skills?: string | null; // Optional string for skills
  user?: Pick<IUser, 'id'> | null;
  userPage?: Pick<IUserPage, 'id'> | null;
  authentication?: Pick<IAuthentication, 'id'> | null;
}

export type NewCharityHubUser = Omit<ICharityHubUser, 'id'> & { id: null };
