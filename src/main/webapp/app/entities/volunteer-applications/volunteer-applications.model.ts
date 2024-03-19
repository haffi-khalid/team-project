import dayjs from 'dayjs/esm';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { ApplicationCategory } from 'app/entities/enumerations/application-category.model';

export interface IVolunteerApplications {
  id: number;
  timeStamp?: dayjs.Dayjs | null;
  volunteerStatus?: ApplicationCategory | null;
  charityAdmin?: Pick<ICharityAdmin, 'id'> | null;
  charityHubUser?: Pick<ICharityHubUser, 'id'> | null;
  vacancies?: Pick<IVacancies, 'id'> | null;
}

export type NewVolunteerApplications = Omit<IVolunteerApplications, 'id'> & { id: null };
