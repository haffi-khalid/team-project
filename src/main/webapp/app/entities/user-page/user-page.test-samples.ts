import { IUserPage, NewUserPage } from './user-page.model';

export const sampleWithRequiredData: IUserPage = {
  id: 63361,
};

export const sampleWithPartialData: IUserPage = {
  id: 75701,
  userBio: 'Cambridgeshire',
  course: 'Cotton',
};

export const sampleWithFullData: IUserPage = {
  id: 56070,
  volunteerHours: 11158,
  userBio: 'Avon',
  reviewComment: 'olive Designer green',
  course: 'Market',
  skills: 'transmit',
};

export const sampleWithNewData: NewUserPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
