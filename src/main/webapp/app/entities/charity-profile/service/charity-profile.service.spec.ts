import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICharityProfile } from '../charity-profile.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../charity-profile.test-samples';

import { CharityProfileService } from './charity-profile.service';

const requireRestSample: ICharityProfile = {
  ...sampleWithRequiredData,
};

describe('CharityProfile Service', () => {
  let service: CharityProfileService;
  let httpMock: HttpTestingController;
  let expectedResult: ICharityProfile | ICharityProfile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CharityProfileService);
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

    it('should create a CharityProfile', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const charityProfile = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(charityProfile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CharityProfile', () => {
      const charityProfile = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(charityProfile).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CharityProfile', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CharityProfile', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CharityProfile', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCharityProfileToCollectionIfMissing', () => {
      it('should add a CharityProfile to an empty array', () => {
        const charityProfile: ICharityProfile = sampleWithRequiredData;
        expectedResult = service.addCharityProfileToCollectionIfMissing([], charityProfile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityProfile);
      });

      it('should not add a CharityProfile to an array that contains it', () => {
        const charityProfile: ICharityProfile = sampleWithRequiredData;
        const charityProfileCollection: ICharityProfile[] = [
          {
            ...charityProfile,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCharityProfileToCollectionIfMissing(charityProfileCollection, charityProfile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CharityProfile to an array that doesn't contain it", () => {
        const charityProfile: ICharityProfile = sampleWithRequiredData;
        const charityProfileCollection: ICharityProfile[] = [sampleWithPartialData];
        expectedResult = service.addCharityProfileToCollectionIfMissing(charityProfileCollection, charityProfile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityProfile);
      });

      it('should add only unique CharityProfile to an array', () => {
        const charityProfileArray: ICharityProfile[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const charityProfileCollection: ICharityProfile[] = [sampleWithRequiredData];
        expectedResult = service.addCharityProfileToCollectionIfMissing(charityProfileCollection, ...charityProfileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const charityProfile: ICharityProfile = sampleWithRequiredData;
        const charityProfile2: ICharityProfile = sampleWithPartialData;
        expectedResult = service.addCharityProfileToCollectionIfMissing([], charityProfile, charityProfile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(charityProfile);
        expect(expectedResult).toContain(charityProfile2);
      });

      it('should accept null and undefined values', () => {
        const charityProfile: ICharityProfile = sampleWithRequiredData;
        expectedResult = service.addCharityProfileToCollectionIfMissing([], null, charityProfile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(charityProfile);
      });

      it('should return initial array if no CharityProfile is added', () => {
        const charityProfileCollection: ICharityProfile[] = [sampleWithRequiredData];
        expectedResult = service.addCharityProfileToCollectionIfMissing(charityProfileCollection, undefined, null);
        expect(expectedResult).toEqual(charityProfileCollection);
      });
    });

    describe('compareCharityProfile', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCharityProfile(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCharityProfile(entity1, entity2);
        const compareResult2 = service.compareCharityProfile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCharityProfile(entity1, entity2);
        const compareResult2 = service.compareCharityProfile(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCharityProfile(entity1, entity2);
        const compareResult2 = service.compareCharityProfile(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
