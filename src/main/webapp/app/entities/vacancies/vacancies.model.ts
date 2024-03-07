import dayjs from 'dayjs/esm';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
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
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewVacancies = Omit<IVacancies, 'id'> & { id: null };
