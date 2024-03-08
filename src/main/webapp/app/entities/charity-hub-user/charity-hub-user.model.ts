import { IUser } from 'app/entities/user/user.model';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { IAuthentication } from 'app/entities/authentication/authentication.model';

export interface ICharityHubUser {
  id: number;
  username?: string | null;
  email?: string | null;
  user?: Pick<IUser, 'id'> | null;
  userPage?: Pick<IUserPage, 'id'> | null;
  authentication?: Pick<IAuthentication, 'id'> | null;
}

export type NewCharityHubUser = Omit<ICharityHubUser, 'id'> & { id: null };
