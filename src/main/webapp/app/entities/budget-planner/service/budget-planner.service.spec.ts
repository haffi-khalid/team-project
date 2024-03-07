import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBudgetPlanner } from '../budget-planner.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../budget-planner.test-samples';

import { BudgetPlannerService } from './budget-planner.service';

const requireRestSample: IBudgetPlanner = {
  ...sampleWithRequiredData,
};

describe('BudgetPlanner Service', () => {
  let service: BudgetPlannerService;
  let httpMock: HttpTestingController;
  let expectedResult: IBudgetPlanner | IBudgetPlanner[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BudgetPlannerService);
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

    it('should create a BudgetPlanner', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const budgetPlanner = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(budgetPlanner).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BudgetPlanner', () => {
      const budgetPlanner = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(budgetPlanner).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BudgetPlanner', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BudgetPlanner', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BudgetPlanner', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBudgetPlannerToCollectionIfMissing', () => {
      it('should add a BudgetPlanner to an empty array', () => {
        const budgetPlanner: IBudgetPlanner = sampleWithRequiredData;
        expectedResult = service.addBudgetPlannerToCollectionIfMissing([], budgetPlanner);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(budgetPlanner);
      });

      it('should not add a BudgetPlanner to an array that contains it', () => {
        const budgetPlanner: IBudgetPlanner = sampleWithRequiredData;
        const budgetPlannerCollection: IBudgetPlanner[] = [
          {
            ...budgetPlanner,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBudgetPlannerToCollectionIfMissing(budgetPlannerCollection, budgetPlanner);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BudgetPlanner to an array that doesn't contain it", () => {
        const budgetPlanner: IBudgetPlanner = sampleWithRequiredData;
        const budgetPlannerCollection: IBudgetPlanner[] = [sampleWithPartialData];
        expectedResult = service.addBudgetPlannerToCollectionIfMissing(budgetPlannerCollection, budgetPlanner);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(budgetPlanner);
      });

      it('should add only unique BudgetPlanner to an array', () => {
        const budgetPlannerArray: IBudgetPlanner[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const budgetPlannerCollection: IBudgetPlanner[] = [sampleWithRequiredData];
        expectedResult = service.addBudgetPlannerToCollectionIfMissing(budgetPlannerCollection, ...budgetPlannerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const budgetPlanner: IBudgetPlanner = sampleWithRequiredData;
        const budgetPlanner2: IBudgetPlanner = sampleWithPartialData;
        expectedResult = service.addBudgetPlannerToCollectionIfMissing([], budgetPlanner, budgetPlanner2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(budgetPlanner);
        expect(expectedResult).toContain(budgetPlanner2);
      });

      it('should accept null and undefined values', () => {
        const budgetPlanner: IBudgetPlanner = sampleWithRequiredData;
        expectedResult = service.addBudgetPlannerToCollectionIfMissing([], null, budgetPlanner, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(budgetPlanner);
      });

      it('should return initial array if no BudgetPlanner is added', () => {
        const budgetPlannerCollection: IBudgetPlanner[] = [sampleWithRequiredData];
        expectedResult = service.addBudgetPlannerToCollectionIfMissing(budgetPlannerCollection, undefined, null);
        expect(expectedResult).toEqual(budgetPlannerCollection);
      });
    });

    describe('compareBudgetPlanner', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBudgetPlanner(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBudgetPlanner(entity1, entity2);
        const compareResult2 = service.compareBudgetPlanner(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBudgetPlanner(entity1, entity2);
        const compareResult2 = service.compareBudgetPlanner(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBudgetPlanner(entity1, entity2);
        const compareResult2 = service.compareBudgetPlanner(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
