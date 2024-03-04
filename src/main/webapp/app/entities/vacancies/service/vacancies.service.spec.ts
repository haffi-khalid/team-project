import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVacancies } from '../vacancies.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vacancies.test-samples';

import { VacanciesService, RestVacancies } from './vacancies.service';

const requireRestSample: RestVacancies = {
  ...sampleWithRequiredData,
  vacancyStartDate: sampleWithRequiredData.vacancyStartDate?.format(DATE_FORMAT),
};

describe('Vacancies Service', () => {
  let service: VacanciesService;
  let httpMock: HttpTestingController;
  let expectedResult: IVacancies | IVacancies[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VacanciesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Vacancies', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vacancies = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vacancies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vacancies', () => {
      const vacancies = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vacancies).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vacancies', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vacancies', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vacancies', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVacanciesToCollectionIfMissing', () => {
      it('should add a Vacancies to an empty array', () => {
        const vacancies: IVacancies = sampleWithRequiredData;
        expectedResult = service.addVacanciesToCollectionIfMissing([], vacancies);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacancies);
      });

      it('should not add a Vacancies to an array that contains it', () => {
        const vacancies: IVacancies = sampleWithRequiredData;
        const vacanciesCollection: IVacancies[] = [
          {
            ...vacancies,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVacanciesToCollectionIfMissing(vacanciesCollection, vacancies);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vacancies to an array that doesn't contain it", () => {
        const vacancies: IVacancies = sampleWithRequiredData;
        const vacanciesCollection: IVacancies[] = [sampleWithPartialData];
        expectedResult = service.addVacanciesToCollectionIfMissing(vacanciesCollection, vacancies);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacancies);
      });

      it('should add only unique Vacancies to an array', () => {
        const vacanciesArray: IVacancies[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vacanciesCollection: IVacancies[] = [sampleWithRequiredData];
        expectedResult = service.addVacanciesToCollectionIfMissing(vacanciesCollection, ...vacanciesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vacancies: IVacancies = sampleWithRequiredData;
        const vacancies2: IVacancies = sampleWithPartialData;
        expectedResult = service.addVacanciesToCollectionIfMissing([], vacancies, vacancies2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vacancies);
        expect(expectedResult).toContain(vacancies2);
      });

      it('should accept null and undefined values', () => {
        const vacancies: IVacancies = sampleWithRequiredData;
        expectedResult = service.addVacanciesToCollectionIfMissing([], null, vacancies, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vacancies);
      });

      it('should return initial array if no Vacancies is added', () => {
        const vacanciesCollection: IVacancies[] = [sampleWithRequiredData];
        expectedResult = service.addVacanciesToCollectionIfMissing(vacanciesCollection, undefined, null);
        expect(expectedResult).toEqual(vacanciesCollection);
      });
    });

    describe('compareVacancies', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVacancies(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVacancies(entity1, entity2);
        const compareResult2 = service.compareVacancies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVacancies(entity1, entity2);
        const compareResult2 = service.compareVacancies(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVacancies(entity1, entity2);
        const compareResult2 = service.compareVacancies(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
