import { IUserPage, NewUserPage } from './user-page.model';

export const sampleWithRequiredData: IUserPage = {
  id: 63361,
};

export const sampleWithPartialData: IUserPage = {
  id: 48791,
  name: 'asymmetric unleash Concrete',
  volunteerHours: 10410,
  course: 'overriding Virtual',
};

export const sampleWithFullData: IUserPage = {
  id: 85421,
  profilePicture: '../fake-data/blob/hipster.png',
  profilePictureContentType: 'unknown',
  name: 'Sausages',
  userBio: '../fake-data/blob/hipster.txt',
  volunteerHours: 60519,
  reviewComment: '../fake-data/blob/hipster.txt',
  course: 'deposit',
  skills: 'application mint Wooden',
};

export const sampleWithNewData: NewUserPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
