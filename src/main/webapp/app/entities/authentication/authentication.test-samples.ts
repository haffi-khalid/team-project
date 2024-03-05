import { IAuthentication, NewAuthentication } from './authentication.model';

export const sampleWithRequiredData: IAuthentication = {
  id: 67932,
};

export const sampleWithPartialData: IAuthentication = {
  id: 52421,
};

export const sampleWithFullData: IAuthentication = {
  id: 68779,
  isAuthenticated: true,
};

export const sampleWithNewData: NewAuthentication = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
