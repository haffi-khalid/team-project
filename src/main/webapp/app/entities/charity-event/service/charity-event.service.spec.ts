import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharityEvent } from '../charity-event.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../charity-event.test-samples';

import { CharityEventService, RestCharityEvent } from './charity-event.service';

const requireRestSample: RestCharityEvent = {
  ...sampleWithRequiredData,
  eventTimeDate: sampleWithRequiredData.eventTimeDate?.toJSON(),
};

describe('CharityEvent Service', () => {
  let service: CharityEventService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharityEvent | ICharityEvent[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharityEventService);
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

    it('should create a CharityEvent', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charityEvent = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charityEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharityEvent', () => {
      const charityEvent = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charityEvent).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharityEvent', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharityEvent', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharityEvent', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharityEventToCollectionIfMissing', () => {
      it('should add a CharityEvent to an empty array', () => {
        const charityEvent: ICharityEvent = sampleWithRequiredData;
        expectedResult = service.addCharityEventToCollectionIfMissing([], charityEvent);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityEvent);
      });

      it('should not add a CharityEvent to an array that contains it', () => {
        const charityEvent: ICharityEvent = sampleWithRequiredData;
        const charityEventCollection: ICharityEvent[] = [
          {
            ...charityEvent,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharityEventToCollectionIfMissing(charityEventCollection, charityEvent);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharityEvent to an array that doesn't contain it", () => {
        const charityEvent: ICharityEvent = sampleWithRequiredData;
        const charityEventCollection: ICharityEvent[] = [sampleWithPartialData];
        expectedResult = service.addCharityEventToCollectionIfMissing(charityEventCollection, charityEvent);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityEvent);
      });

      it('should add only unique CharityEvent to an array', () => {
        const charityEventArray: ICharityEvent[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charityEventCollection: ICharityEvent[] = [sampleWithRequiredData];
        expectedResult = service.addCharityEventToCollectionIfMissing(charityEventCollection, ...charityEventArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charityEvent: ICharityEvent = sampleWithRequiredData;
        const charityEvent2: ICharityEvent = sampleWithPartialData;
        expectedResult = service.addCharityEventToCollectionIfMissing([], charityEvent, charityEvent2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityEvent);
        expect(expectedResult).toContain(charityEvent2);
      });

      it('should accept null and undefined values', () => {
        const charityEvent: ICharityEvent = sampleWithRequiredData;
        expectedResult = service.addCharityEventToCollectionIfMissing([], null, charityEvent, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityEvent);
      });

      it('should return initial array if no CharityEvent is added', () => {
        const charityEventCollection: ICharityEvent[] = [sampleWithRequiredData];
        expectedResult = service.addCharityEventToCollectionIfMissing(charityEventCollection, undefined, null);
        expect(expectedResult).toEqual(charityEventCollection);
      });
    });

    describe('compareCharityEvent', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharityEvent(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCharityEvent(entity1, entity2);
        const compareResult2 = service.compareCharityEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCharityEvent(entity1, entity2);
        const compareResult2 = service.compareCharityEvent(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCharityEvent(entity1, entity2);
        const compareResult2 = service.compareCharityEvent(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
