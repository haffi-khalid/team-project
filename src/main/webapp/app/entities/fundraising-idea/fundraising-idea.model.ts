import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

export interface IFundraisingIdea {
  id: number;
  ideaName?: string | null;
  ideaDescription?: string | null;
  numberOfVolunteers?: number | null;
  location?: LocationCategory | null;
  expectedCost?: number | null;
  expectedAttendance?: number | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewFundraisingIdea = Omit<IFundraisingIdea, 'id'> & { id: null };
