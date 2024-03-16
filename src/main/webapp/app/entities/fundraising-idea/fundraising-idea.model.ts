import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

export interface IFundraisingIdea {
  id: number;
  ideaName?: string | null;
  ideaDescription?: string | null;
  numberOfVolunteers?: number | null;
  location?: LocationCategory | null;
  expectedCost?: number | null;
  expectedAttendance?: number | null;
  charityAdmin?: Pick<ICharityAdmin, 'id'> | null;
}

export type NewFundraisingIdea = Omit<IFundraisingIdea, 'id'> & { id: null };
