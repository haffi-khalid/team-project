import dayjs from 'dayjs/esm';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';

export interface ICharityEvent {
  id: number;
  eventName?: string | null;
  eventTimeDate?: dayjs.Dayjs | null;
  description?: string | null;
  images?: string | null;
  imagesContentType?: string | null;
  duration?: number | null;
  charityProfile?: Pick<ICharityProfile, 'id' | 'charityName' | 'logo' | 'logoContentType'> | null;
}

export type NewCharityEvent = Omit<ICharityEvent, 'id'> & { id: null };
