import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';

export interface IApprovedVolunteers {
  id: number;
  volunteerStatus?: boolean | null;
  volunteerHoursCompletedInCharity?: number | null;
  currentEventVolunteeringIn?: string | null;
  charityHubUser?: Pick<ICharityHubUser, 'id'> | null;
  charityAdmin?: Pick<ICharityAdmin, 'id'> | null;
}

export type NewApprovedVolunteers = Omit<IApprovedVolunteers, 'id'> & { id: null };
