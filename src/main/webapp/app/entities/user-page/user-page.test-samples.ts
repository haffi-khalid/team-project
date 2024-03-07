import { IUserPage, NewUserPage } from './user-page.model';

export const sampleWithRequiredData: IUserPage = {
  id: 63361,
};

export const sampleWithPartialData: IUserPage = {
  id: 75701,
  userBio: '../fake-data/blob/hipster.txt',
  course: 'Cambridgeshire',
};

export const sampleWithFullData: IUserPage = {
  id: 8397,
  volunteerHours: 13234,
  userBio: '../fake-data/blob/hipster.txt',
  reviewComment: '../fake-data/blob/hipster.txt',
  course: 'quantify sky',
  skills: 'overriding Virtual',
};

export const sampleWithNewData: NewUserPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
