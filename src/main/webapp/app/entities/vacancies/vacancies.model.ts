import dayjs from 'dayjs/esm';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

export interface IVacancies {
  id: number;
  vacancyTitle?: string | null;
  vacancyDescription?: string | null;
  vacancyStartDate?: dayjs.Dayjs | null;
  vacancyLogo?: string | null;
  vacancyLogoContentType?: string | null;
  vacancyDuration?: number | null;
  vacancyLocation?: LocationCategory | null;
  charityAdmin?: Pick<ICharityAdmin, 'id'> | null;
}

export type NewVacancies = Omit<IVacancies, 'id'> & { id: null };
