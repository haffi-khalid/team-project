import { IGroupDonator } from 'app/entities/group-donator/group-donator.model';

export interface IGroupDonatorCollector {
  id: number;
  donatorName?: string | null;
  donationAmount?: number | null;
  groupDonator?: Pick<IGroupDonator, 'id'> | null;
}

export type NewGroupDonatorCollector = Omit<IGroupDonatorCollector, 'id'> & { id: null };
