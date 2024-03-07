import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroupDonator } from '../group-donator.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../group-donator.test-samples';

import { GroupDonatorService } from './group-donator.service';

const requireRestSample: IGroupDonator = {
  ...sampleWithRequiredData,
};

describe('GroupDonator Service', () => {
  let service: GroupDonatorService;
  let httpMock: HttpTestingController;
  let expectedResult: IGroupDonator | IGroupDonator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GroupDonatorService);
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

    it('should create a GroupDonator', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const groupDonator = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(groupDonator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GroupDonator', () => {
      const groupDonator = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(groupDonator).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GroupDonator', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GroupDonator', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GroupDonator', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGroupDonatorToCollectionIfMissing', () => {
      it('should add a GroupDonator to an empty array', () => {
        const groupDonator: IGroupDonator = sampleWithRequiredData;
        expectedResult = service.addGroupDonatorToCollectionIfMissing([], groupDonator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupDonator);
      });

      it('should not add a GroupDonator to an array that contains it', () => {
        const groupDonator: IGroupDonator = sampleWithRequiredData;
        const groupDonatorCollection: IGroupDonator[] = [
          {
            ...groupDonator,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGroupDonatorToCollectionIfMissing(groupDonatorCollection, groupDonator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GroupDonator to an array that doesn't contain it", () => {
        const groupDonator: IGroupDonator = sampleWithRequiredData;
        const groupDonatorCollection: IGroupDonator[] = [sampleWithPartialData];
        expectedResult = service.addGroupDonatorToCollectionIfMissing(groupDonatorCollection, groupDonator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupDonator);
      });

      it('should add only unique GroupDonator to an array', () => {
        const groupDonatorArray: IGroupDonator[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const groupDonatorCollection: IGroupDonator[] = [sampleWithRequiredData];
        expectedResult = service.addGroupDonatorToCollectionIfMissing(groupDonatorCollection, ...groupDonatorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const groupDonator: IGroupDonator = sampleWithRequiredData;
        const groupDonator2: IGroupDonator = sampleWithPartialData;
        expectedResult = service.addGroupDonatorToCollectionIfMissing([], groupDonator, groupDonator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupDonator);
        expect(expectedResult).toContain(groupDonator2);
      });

      it('should accept null and undefined values', () => {
        const groupDonator: IGroupDonator = sampleWithRequiredData;
        expectedResult = service.addGroupDonatorToCollectionIfMissing([], null, groupDonator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupDonator);
      });

      it('should return initial array if no GroupDonator is added', () => {
        const groupDonatorCollection: IGroupDonator[] = [sampleWithRequiredData];
        expectedResult = service.addGroupDonatorToCollectionIfMissing(groupDonatorCollection, undefined, null);
        expect(expectedResult).toEqual(groupDonatorCollection);
      });
    });

    describe('compareGroupDonator', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGroupDonator(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGroupDonator(entity1, entity2);
        const compareResult2 = service.compareGroupDonator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGroupDonator(entity1, entity2);
        const compareResult2 = service.compareGroupDonator(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGroupDonator(entity1, entity2);
        const compareResult2 = service.compareGroupDonator(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
