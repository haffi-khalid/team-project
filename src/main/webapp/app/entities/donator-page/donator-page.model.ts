import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface IDonatorPage {
  id: number;
  name?: string | null;
  anonymous?: boolean | null;
  amount?: number | null;
  groupDonation?: boolean | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName'> | null;
}

export type NewDonatorPage = Omit<IDonatorPage, 'id'> & { id: null };
