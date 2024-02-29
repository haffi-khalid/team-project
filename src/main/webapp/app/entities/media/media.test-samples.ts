import { IMedia, NewMedia } from './media.model';

export const sampleWithRequiredData: IMedia = {
  id: 70740,
};

export const sampleWithPartialData: IMedia = {
  id: 55322,
  url: 'https://valentina.net',
};

export const sampleWithFullData: IMedia = {
  id: 91608,
  type: 'Sausages Wooden',
  url: 'http://sam.biz',
};

export const sampleWithNewData: NewMedia = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
