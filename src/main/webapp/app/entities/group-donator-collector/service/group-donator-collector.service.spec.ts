import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGroupDonatorCollector } from '../group-donator-collector.model';
import {
  sampleWithRequiredData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithFullData,
} from '../group-donator-collector.test-samples';

import { GroupDonatorCollectorService } from './group-donator-collector.service';

const requireRestSample: IGroupDonatorCollector = {
  ...sampleWithRequiredData,
};

describe('GroupDonatorCollector Service', () => {
  let service: GroupDonatorCollectorService;
  let httpMock: HttpTestingController;
  let expectedResult: IGroupDonatorCollector | IGroupDonatorCollector[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GroupDonatorCollectorService);
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

    it('should create a GroupDonatorCollector', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const groupDonatorCollector = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(groupDonatorCollector).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GroupDonatorCollector', () => {
      const groupDonatorCollector = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(groupDonatorCollector).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GroupDonatorCollector', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GroupDonatorCollector', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GroupDonatorCollector', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGroupDonatorCollectorToCollectionIfMissing', () => {
      it('should add a GroupDonatorCollector to an empty array', () => {
        const groupDonatorCollector: IGroupDonatorCollector = sampleWithRequiredData;
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing([], groupDonatorCollector);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupDonatorCollector);
      });

      it('should not add a GroupDonatorCollector to an array that contains it', () => {
        const groupDonatorCollector: IGroupDonatorCollector = sampleWithRequiredData;
        const groupDonatorCollectorCollection: IGroupDonatorCollector[] = [
          {
            ...groupDonatorCollector,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing(groupDonatorCollectorCollection, groupDonatorCollector);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GroupDonatorCollector to an array that doesn't contain it", () => {
        const groupDonatorCollector: IGroupDonatorCollector = sampleWithRequiredData;
        const groupDonatorCollectorCollection: IGroupDonatorCollector[] = [sampleWithPartialData];
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing(groupDonatorCollectorCollection, groupDonatorCollector);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupDonatorCollector);
      });

      it('should add only unique GroupDonatorCollector to an array', () => {
        const groupDonatorCollectorArray: IGroupDonatorCollector[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const groupDonatorCollectorCollection: IGroupDonatorCollector[] = [sampleWithRequiredData];
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing(
          groupDonatorCollectorCollection,
          ...groupDonatorCollectorArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const groupDonatorCollector: IGroupDonatorCollector = sampleWithRequiredData;
        const groupDonatorCollector2: IGroupDonatorCollector = sampleWithPartialData;
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing([], groupDonatorCollector, groupDonatorCollector2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(groupDonatorCollector);
        expect(expectedResult).toContain(groupDonatorCollector2);
      });

      it('should accept null and undefined values', () => {
        const groupDonatorCollector: IGroupDonatorCollector = sampleWithRequiredData;
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing([], null, groupDonatorCollector, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(groupDonatorCollector);
      });

      it('should return initial array if no GroupDonatorCollector is added', () => {
        const groupDonatorCollectorCollection: IGroupDonatorCollector[] = [sampleWithRequiredData];
        expectedResult = service.addGroupDonatorCollectorToCollectionIfMissing(groupDonatorCollectorCollection, undefined, null);
        expect(expectedResult).toEqual(groupDonatorCollectorCollection);
      });
    });

    describe('compareGroupDonatorCollector', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGroupDonatorCollector(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGroupDonatorCollector(entity1, entity2);
        const compareResult2 = service.compareGroupDonatorCollector(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGroupDonatorCollector(entity1, entity2);
        const compareResult2 = service.compareGroupDonatorCollector(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGroupDonatorCollector(entity1, entity2);
        const compareResult2 = service.compareGroupDonatorCollector(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
