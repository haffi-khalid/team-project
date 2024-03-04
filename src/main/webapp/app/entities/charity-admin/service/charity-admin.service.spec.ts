import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharityAdmin } from '../charity-admin.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../charity-admin.test-samples';

import { CharityAdminService } from './charity-admin.service';

const requireRestSample: ICharityAdmin = {
  ...sampleWithRequiredData,
};

describe('CharityAdmin Service', () => {
  let service: CharityAdminService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharityAdmin | ICharityAdmin[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharityAdminService);
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

    it('should create a CharityAdmin', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charityAdmin = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charityAdmin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharityAdmin', () => {
      const charityAdmin = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charityAdmin).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharityAdmin', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharityAdmin', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharityAdmin', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharityAdminToCollectionIfMissing', () => {
      it('should add a CharityAdmin to an empty array', () => {
        const charityAdmin: ICharityAdmin = sampleWithRequiredData;
        expectedResult = service.addCharityAdminToCollectionIfMissing([], charityAdmin);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityAdmin);
      });

      it('should not add a CharityAdmin to an array that contains it', () => {
        const charityAdmin: ICharityAdmin = sampleWithRequiredData;
        const charityAdminCollection: ICharityAdmin[] = [
          {
            ...charityAdmin,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharityAdminToCollectionIfMissing(charityAdminCollection, charityAdmin);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharityAdmin to an array that doesn't contain it", () => {
        const charityAdmin: ICharityAdmin = sampleWithRequiredData;
        const charityAdminCollection: ICharityAdmin[] = [sampleWithPartialData];
        expectedResult = service.addCharityAdminToCollectionIfMissing(charityAdminCollection, charityAdmin);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityAdmin);
      });

      it('should add only unique CharityAdmin to an array', () => {
        const charityAdminArray: ICharityAdmin[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charityAdminCollection: ICharityAdmin[] = [sampleWithRequiredData];
        expectedResult = service.addCharityAdminToCollectionIfMissing(charityAdminCollection, ...charityAdminArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charityAdmin: ICharityAdmin = sampleWithRequiredData;
        const charityAdmin2: ICharityAdmin = sampleWithPartialData;
        expectedResult = service.addCharityAdminToCollectionIfMissing([], charityAdmin, charityAdmin2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityAdmin);
        expect(expectedResult).toContain(charityAdmin2);
      });

      it('should accept null and undefined values', () => {
        const charityAdmin: ICharityAdmin = sampleWithRequiredData;
        expectedResult = service.addCharityAdminToCollectionIfMissing([], null, charityAdmin, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityAdmin);
      });

      it('should return initial array if no CharityAdmin is added', () => {
        const charityAdminCollection: ICharityAdmin[] = [sampleWithRequiredData];
        expectedResult = service.addCharityAdminToCollectionIfMissing(charityAdminCollection, undefined, null);
        expect(expectedResult).toEqual(charityAdminCollection);
      });
    });

    describe('compareCharityAdmin', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharityAdmin(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCharityAdmin(entity1, entity2);
        const compareResult2 = service.compareCharityAdmin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCharityAdmin(entity1, entity2);
        const compareResult2 = service.compareCharityAdmin(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCharityAdmin(entity1, entity2);
        const compareResult2 = service.compareCharityAdmin(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
