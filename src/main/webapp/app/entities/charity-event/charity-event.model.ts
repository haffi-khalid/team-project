import dayjs from 'dayjs/esm';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';

export interface ICharityEvent {
  id: number;
  eventName?: string | null;
  eventTimeDate?: dayjs.Dayjs | null;
  description?: string | null;
  images?: string | null;
  imagesContentType?: string | null;
  duration?: number | null;
  charityAdmin?: Pick<ICharityAdmin, 'id'> | null;
}

export type NewCharityEvent = Omit<ICharityEvent, 'id'> & { id: null };
