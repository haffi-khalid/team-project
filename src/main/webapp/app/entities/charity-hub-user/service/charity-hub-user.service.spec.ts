import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharityHubUser } from '../charity-hub-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../charity-hub-user.test-samples';

import { CharityHubUserService } from './charity-hub-user.service';

const requireRestSample: ICharityHubUser = {
  ...sampleWithRequiredData,
};

describe('CharityHubUser Service', () => {
  let service: CharityHubUserService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharityHubUser | ICharityHubUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharityHubUserService);
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

    it('should create a CharityHubUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charityHubUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charityHubUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharityHubUser', () => {
      const charityHubUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charityHubUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharityHubUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharityHubUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharityHubUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharityHubUserToCollectionIfMissing', () => {
      it('should add a CharityHubUser to an empty array', () => {
        const charityHubUser: ICharityHubUser = sampleWithRequiredData;
        expectedResult = service.addCharityHubUserToCollectionIfMissing([], charityHubUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityHubUser);
      });

      it('should not add a CharityHubUser to an array that contains it', () => {
        const charityHubUser: ICharityHubUser = sampleWithRequiredData;
        const charityHubUserCollection: ICharityHubUser[] = [
          {
            ...charityHubUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharityHubUserToCollectionIfMissing(charityHubUserCollection, charityHubUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharityHubUser to an array that doesn't contain it", () => {
        const charityHubUser: ICharityHubUser = sampleWithRequiredData;
        const charityHubUserCollection: ICharityHubUser[] = [sampleWithPartialData];
        expectedResult = service.addCharityHubUserToCollectionIfMissing(charityHubUserCollection, charityHubUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityHubUser);
      });

      it('should add only unique CharityHubUser to an array', () => {
        const charityHubUserArray: ICharityHubUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charityHubUserCollection: ICharityHubUser[] = [sampleWithRequiredData];
        expectedResult = service.addCharityHubUserToCollectionIfMissing(charityHubUserCollection, ...charityHubUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charityHubUser: ICharityHubUser = sampleWithRequiredData;
        const charityHubUser2: ICharityHubUser = sampleWithPartialData;
        expectedResult = service.addCharityHubUserToCollectionIfMissing([], charityHubUser, charityHubUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityHubUser);
        expect(expectedResult).toContain(charityHubUser2);
      });

      it('should accept null and undefined values', () => {
        const charityHubUser: ICharityHubUser = sampleWithRequiredData;
        expectedResult = service.addCharityHubUserToCollectionIfMissing([], null, charityHubUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityHubUser);
      });

      it('should return initial array if no CharityHubUser is added', () => {
        const charityHubUserCollection: ICharityHubUser[] = [sampleWithRequiredData];
        expectedResult = service.addCharityHubUserToCollectionIfMissing(charityHubUserCollection, undefined, null);
        expect(expectedResult).toEqual(charityHubUserCollection);
      });
    });

    describe('compareCharityHubUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharityHubUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCharityHubUser(entity1, entity2);
        const compareResult2 = service.compareCharityHubUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCharityHubUser(entity1, entity2);
        const compareResult2 = service.compareCharityHubUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCharityHubUser(entity1, entity2);
        const compareResult2 = service.compareCharityHubUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
