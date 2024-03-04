import dayjs from 'dayjs/esm';

import { ApplicationCategory } from 'app/entities/enumerations/application-category.model';

import { IVolunteerApplications, NewVolunteerApplications } from './volunteer-applications.model';

export const sampleWithRequiredData: IVolunteerApplications = {
  id: 43057,
};

export const sampleWithPartialData: IVolunteerApplications = {
  id: 94645,
};

export const sampleWithFullData: IVolunteerApplications = {
  id: 4855,
  timeStamp: dayjs('2024-03-03T07:19'),
  volunteerStatus: ApplicationCategory['INTERVIEW'],
};

export const sampleWithNewData: NewVolunteerApplications = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
