import dayjs from 'dayjs/esm';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { ApplicationCategory } from 'app/entities/enumerations/application-category.model';

export interface IVolunteerApplications {
  id: number;
  timeStamp?: dayjs.Dayjs | null;
  volunteerStatus?: ApplicationCategory | null;
  charityProfile?: Pick<ICharityProfile, 'id'> | null;
  userPage?: Pick<IUserPage, 'id' | 'user'> | null;
  vacancies?: Pick<IVacancies, 'id'> | null;
}

export type NewVolunteerApplications = Omit<IVolunteerApplications, 'id'> & { id: null };
