import { IVolunteerApplications } from 'app/entities/volunteer-applications/volunteer-applications.model';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface IApprovedVolunteers {
  id: number;
  volunteerStatus?: boolean | null;
  volunteerHoursCompletedInCharity?: number | null;
  currentEventVolunteeringIn?: string | null;
  volunteerApplications?: Pick<IVolunteerApplications, 'id'> | null;
  userPage?: Pick<IUserPage, 'id'> | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewApprovedVolunteers = Omit<IApprovedVolunteers, 'id'> & { id: null };
