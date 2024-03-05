import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVolunteerApplications } from '../volunteer-applications.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../volunteer-applications.test-samples';

import { VolunteerApplicationsService, RestVolunteerApplications } from './volunteer-applications.service';

const requireRestSample: RestVolunteerApplications = {
  ...sampleWithRequiredData,
  timeStamp: sampleWithRequiredData.timeStamp?.toJSON(),
};

describe('VolunteerApplications Service', () => {
  let service: VolunteerApplicationsService;
  let httpMock: HttpTestingController;
  let expectedResult: IVolunteerApplications | IVolunteerApplications[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VolunteerApplicationsService);
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

    it('should create a VolunteerApplications', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const volunteerApplications = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(volunteerApplications).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VolunteerApplications', () => {
      const volunteerApplications = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(volunteerApplications).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VolunteerApplications', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VolunteerApplications', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VolunteerApplications', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVolunteerApplicationsToCollectionIfMissing', () => {
      it('should add a VolunteerApplications to an empty array', () => {
        const volunteerApplications: IVolunteerApplications = sampleWithRequiredData;
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing([], volunteerApplications);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(volunteerApplications);
      });

      it('should not add a VolunteerApplications to an array that contains it', () => {
        const volunteerApplications: IVolunteerApplications = sampleWithRequiredData;
        const volunteerApplicationsCollection: IVolunteerApplications[] = [
          {
            ...volunteerApplications,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing(volunteerApplicationsCollection, volunteerApplications);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VolunteerApplications to an array that doesn't contain it", () => {
        const volunteerApplications: IVolunteerApplications = sampleWithRequiredData;
        const volunteerApplicationsCollection: IVolunteerApplications[] = [sampleWithPartialData];
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing(volunteerApplicationsCollection, volunteerApplications);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(volunteerApplications);
      });

      it('should add only unique VolunteerApplications to an array', () => {
        const volunteerApplicationsArray: IVolunteerApplications[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const volunteerApplicationsCollection: IVolunteerApplications[] = [sampleWithRequiredData];
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing(
          volunteerApplicationsCollection,
          ...volunteerApplicationsArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const volunteerApplications: IVolunteerApplications = sampleWithRequiredData;
        const volunteerApplications2: IVolunteerApplications = sampleWithPartialData;
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing([], volunteerApplications, volunteerApplications2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(volunteerApplications);
        expect(expectedResult).toContain(volunteerApplications2);
      });

      it('should accept null and undefined values', () => {
        const volunteerApplications: IVolunteerApplications = sampleWithRequiredData;
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing([], null, volunteerApplications, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(volunteerApplications);
      });

      it('should return initial array if no VolunteerApplications is added', () => {
        const volunteerApplicationsCollection: IVolunteerApplications[] = [sampleWithRequiredData];
        expectedResult = service.addVolunteerApplicationsToCollectionIfMissing(volunteerApplicationsCollection, undefined, null);
        expect(expectedResult).toEqual(volunteerApplicationsCollection);
      });
    });

    describe('compareVolunteerApplications', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVolunteerApplications(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVolunteerApplications(entity1, entity2);
        const compareResult2 = service.compareVolunteerApplications(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVolunteerApplications(entity1, entity2);
        const compareResult2 = service.compareVolunteerApplications(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVolunteerApplications(entity1, entity2);
        const compareResult2 = service.compareVolunteerApplications(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
