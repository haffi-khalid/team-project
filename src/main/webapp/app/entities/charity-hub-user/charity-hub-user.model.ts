import { IUser } from 'app/entities/user/user.model';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { IAuthentication } from 'app/entities/authentication/authentication.model';

export interface ICharityHubUser {
  id: number;
  username?: string | null;
  email?: string | null;
  volunteerHours?: number | null; // Optional integer field for volunteer hours
  name?: string | null;
  userBio?: string | null; // Optional string for user biography
  reviewComment?: string | null; // Optional string for review comments
  course?: string | null; // Optional string for course
  skills?: string | null; // Optional string for skills
  images?: string | null; // Field for image data, using 'any' to accommodate file data
  imagesContentType?: string | null; // Field for storing the MIME type of the image
  user?: Pick<IUser, 'id'> | null;
  userPage?: Pick<IUserPage, 'id'> | null;
  authentication?: Pick<IAuthentication, 'id'> | null;
}

export type NewCharityHubUser = Omit<ICharityHubUser, 'id'> & { id: null };
