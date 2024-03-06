import { IDonatorPage } from 'app/entities/donator-page/donator-page.model';
import { ICharityEvent } from 'app/entities/charity-event/charity-event.model';

export interface IGroupDonator {
  id: number;
  groupname?: string | null;
  totalCollectedAmount?: number | null;
  donatorPage?: Pick<IDonatorPage, 'id'> | null;
  charityEvent?: Pick<ICharityEvent, 'id'> | null;
}

export type NewGroupDonator = Omit<IGroupDonator, 'id'> & { id: null };
