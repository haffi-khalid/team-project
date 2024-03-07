import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IApprovedVolunteers } from '../approved-volunteers.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../approved-volunteers.test-samples';

import { ApprovedVolunteersService } from './approved-volunteers.service';

const requireRestSample: IApprovedVolunteers = {
  ...sampleWithRequiredData,
};

describe('ApprovedVolunteers Service', () => {
  let service: ApprovedVolunteersService;
  let httpMock: HttpTestingController;
  let expectedResult: IApprovedVolunteers | IApprovedVolunteers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ApprovedVolunteersService);
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

    it('should create a ApprovedVolunteers', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const approvedVolunteers = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(approvedVolunteers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ApprovedVolunteers', () => {
      const approvedVolunteers = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(approvedVolunteers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ApprovedVolunteers', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ApprovedVolunteers', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ApprovedVolunteers', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addApprovedVolunteersToCollectionIfMissing', () => {
      it('should add a ApprovedVolunteers to an empty array', () => {
        const approvedVolunteers: IApprovedVolunteers = sampleWithRequiredData;
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing([], approvedVolunteers);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(approvedVolunteers);
      });

      it('should not add a ApprovedVolunteers to an array that contains it', () => {
        const approvedVolunteers: IApprovedVolunteers = sampleWithRequiredData;
        const approvedVolunteersCollection: IApprovedVolunteers[] = [
          {
            ...approvedVolunteers,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing(approvedVolunteersCollection, approvedVolunteers);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ApprovedVolunteers to an array that doesn't contain it", () => {
        const approvedVolunteers: IApprovedVolunteers = sampleWithRequiredData;
        const approvedVolunteersCollection: IApprovedVolunteers[] = [sampleWithPartialData];
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing(approvedVolunteersCollection, approvedVolunteers);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(approvedVolunteers);
      });

      it('should add only unique ApprovedVolunteers to an array', () => {
        const approvedVolunteersArray: IApprovedVolunteers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const approvedVolunteersCollection: IApprovedVolunteers[] = [sampleWithRequiredData];
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing(approvedVolunteersCollection, ...approvedVolunteersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const approvedVolunteers: IApprovedVolunteers = sampleWithRequiredData;
        const approvedVolunteers2: IApprovedVolunteers = sampleWithPartialData;
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing([], approvedVolunteers, approvedVolunteers2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(approvedVolunteers);
        expect(expectedResult).toContain(approvedVolunteers2);
      });

      it('should accept null and undefined values', () => {
        const approvedVolunteers: IApprovedVolunteers = sampleWithRequiredData;
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing([], null, approvedVolunteers, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(approvedVolunteers);
      });

      it('should return initial array if no ApprovedVolunteers is added', () => {
        const approvedVolunteersCollection: IApprovedVolunteers[] = [sampleWithRequiredData];
        expectedResult = service.addApprovedVolunteersToCollectionIfMissing(approvedVolunteersCollection, undefined, null);
        expect(expectedResult).toEqual(approvedVolunteersCollection);
      });
    });

    describe('compareApprovedVolunteers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareApprovedVolunteers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareApprovedVolunteers(entity1, entity2);
        const compareResult2 = service.compareApprovedVolunteers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareApprovedVolunteers(entity1, entity2);
        const compareResult2 = service.compareApprovedVolunteers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareApprovedVolunteers(entity1, entity2);
        const compareResult2 = service.compareApprovedVolunteers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
