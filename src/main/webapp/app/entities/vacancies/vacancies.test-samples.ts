import dayjs from 'dayjs/esm';

import { LocationCategory } from 'app/entities/enumerations/location-category.model';

import { IVacancies, NewVacancies } from './vacancies.model';

export const sampleWithRequiredData: IVacancies = {
  id: 94275,
};

export const sampleWithPartialData: IVacancies = {
  id: 44697,
  vacancyTitle: 'Anguilla Implemented',
};

export const sampleWithFullData: IVacancies = {
  id: 60143,
  vacancyTitle: 'Buckinghamshire Locks supply-chains',
  vacancyDescription: '../fake-data/blob/hipster.txt',
  vacancyStartDate: dayjs('2024-03-05'),
  vacancyLogo: '../fake-data/blob/hipster.png',
  vacancyLogoContentType: 'unknown',
  vacancyDuration: 12568,
  vacancyLocation: LocationCategory['INPERSON'],
};

export const sampleWithNewData: NewVacancies = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
