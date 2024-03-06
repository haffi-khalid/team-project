import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserPage } from '../user-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-page.test-samples';

import { UserPageService } from './user-page.service';

const requireRestSample: IUserPage = {
  ...sampleWithRequiredData,
};

describe('UserPage Service', () => {
  let service: UserPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserPage | IUserPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserPageService);
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

    it('should create a UserPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserPage', () => {
      const userPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserPageToCollectionIfMissing', () => {
      it('should add a UserPage to an empty array', () => {
        const userPage: IUserPage = sampleWithRequiredData;
        expectedResult = service.addUserPageToCollectionIfMissing([], userPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPage);
      });

      it('should not add a UserPage to an array that contains it', () => {
        const userPage: IUserPage = sampleWithRequiredData;
        const userPageCollection: IUserPage[] = [
          {
            ...userPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserPageToCollectionIfMissing(userPageCollection, userPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserPage to an array that doesn't contain it", () => {
        const userPage: IUserPage = sampleWithRequiredData;
        const userPageCollection: IUserPage[] = [sampleWithPartialData];
        expectedResult = service.addUserPageToCollectionIfMissing(userPageCollection, userPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPage);
      });

      it('should add only unique UserPage to an array', () => {
        const userPageArray: IUserPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userPageCollection: IUserPage[] = [sampleWithRequiredData];
        expectedResult = service.addUserPageToCollectionIfMissing(userPageCollection, ...userPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userPage: IUserPage = sampleWithRequiredData;
        const userPage2: IUserPage = sampleWithPartialData;
        expectedResult = service.addUserPageToCollectionIfMissing([], userPage, userPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userPage);
        expect(expectedResult).toContain(userPage2);
      });

      it('should accept null and undefined values', () => {
        const userPage: IUserPage = sampleWithRequiredData;
        expectedResult = service.addUserPageToCollectionIfMissing([], null, userPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userPage);
      });

      it('should return initial array if no UserPage is added', () => {
        const userPageCollection: IUserPage[] = [sampleWithRequiredData];
        expectedResult = service.addUserPageToCollectionIfMissing(userPageCollection, undefined, null);
        expect(expectedResult).toEqual(userPageCollection);
      });
    });

    describe('compareUserPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserPage(entity1, entity2);
        const compareResult2 = service.compareUserPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserPage(entity1, entity2);
        const compareResult2 = service.compareUserPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserPage(entity1, entity2);
        const compareResult2 = service.compareUserPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
