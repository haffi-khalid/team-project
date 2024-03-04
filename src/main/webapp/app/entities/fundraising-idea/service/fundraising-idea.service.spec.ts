import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFundraisingIdea } from '../fundraising-idea.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fundraising-idea.test-samples';

import { FundraisingIdeaService } from './fundraising-idea.service';

const requireRestSample: IFundraisingIdea = {
  ...sampleWithRequiredData,
};

describe('FundraisingIdea Service', () => {
  let service: FundraisingIdeaService;
  let httpMock: HttpTestingController;
  let expectedResult: IFundraisingIdea | IFundraisingIdea[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FundraisingIdeaService);
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

    it('should create a FundraisingIdea', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fundraisingIdea = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fundraisingIdea).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FundraisingIdea', () => {
      const fundraisingIdea = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fundraisingIdea).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FundraisingIdea', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FundraisingIdea', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FundraisingIdea', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFundraisingIdeaToCollectionIfMissing', () => {
      it('should add a FundraisingIdea to an empty array', () => {
        const fundraisingIdea: IFundraisingIdea = sampleWithRequiredData;
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing([], fundraisingIdea);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fundraisingIdea);
      });

      it('should not add a FundraisingIdea to an array that contains it', () => {
        const fundraisingIdea: IFundraisingIdea = sampleWithRequiredData;
        const fundraisingIdeaCollection: IFundraisingIdea[] = [
          {
            ...fundraisingIdea,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing(fundraisingIdeaCollection, fundraisingIdea);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FundraisingIdea to an array that doesn't contain it", () => {
        const fundraisingIdea: IFundraisingIdea = sampleWithRequiredData;
        const fundraisingIdeaCollection: IFundraisingIdea[] = [sampleWithPartialData];
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing(fundraisingIdeaCollection, fundraisingIdea);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fundraisingIdea);
      });

      it('should add only unique FundraisingIdea to an array', () => {
        const fundraisingIdeaArray: IFundraisingIdea[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const fundraisingIdeaCollection: IFundraisingIdea[] = [sampleWithRequiredData];
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing(fundraisingIdeaCollection, ...fundraisingIdeaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fundraisingIdea: IFundraisingIdea = sampleWithRequiredData;
        const fundraisingIdea2: IFundraisingIdea = sampleWithPartialData;
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing([], fundraisingIdea, fundraisingIdea2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fundraisingIdea);
        expect(expectedResult).toContain(fundraisingIdea2);
      });

      it('should accept null and undefined values', () => {
        const fundraisingIdea: IFundraisingIdea = sampleWithRequiredData;
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing([], null, fundraisingIdea, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fundraisingIdea);
      });

      it('should return initial array if no FundraisingIdea is added', () => {
        const fundraisingIdeaCollection: IFundraisingIdea[] = [sampleWithRequiredData];
        expectedResult = service.addFundraisingIdeaToCollectionIfMissing(fundraisingIdeaCollection, undefined, null);
        expect(expectedResult).toEqual(fundraisingIdeaCollection);
      });
    });

    describe('compareFundraisingIdea', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFundraisingIdea(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFundraisingIdea(entity1, entity2);
        const compareResult2 = service.compareFundraisingIdea(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFundraisingIdea(entity1, entity2);
        const compareResult2 = service.compareFundraisingIdea(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFundraisingIdea(entity1, entity2);
        const compareResult2 = service.compareFundraisingIdea(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
