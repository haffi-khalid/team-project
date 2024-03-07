import { IApprovedVolunteers, NewApprovedVolunteers } from './approved-volunteers.model';

export const sampleWithRequiredData: IApprovedVolunteers = {
  id: 71753,
};

export const sampleWithPartialData: IApprovedVolunteers = {
  id: 72439,
};

export const sampleWithFullData: IApprovedVolunteers = {
  id: 51637,
  volunteerStatus: true,
  volunteerHoursCompletedInCharity: 34336,
  currentEventVolunteeringIn: 'Manors Associate Customer',
};

export const sampleWithNewData: NewApprovedVolunteers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
