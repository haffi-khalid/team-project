import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISocialFeed } from '../social-feed.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../social-feed.test-samples';

import { SocialFeedService, RestSocialFeed } from './social-feed.service';

const requireRestSample: RestSocialFeed = {
  ...sampleWithRequiredData,
  lastUpdated: sampleWithRequiredData.lastUpdated?.toJSON(),
};

describe('SocialFeed Service', () => {
  let service: SocialFeedService;
  let httpMock: HttpTestingController;
  let expectedResult: ISocialFeed | ISocialFeed[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SocialFeedService);
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

    it('should create a SocialFeed', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const socialFeed = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(socialFeed).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SocialFeed', () => {
      const socialFeed = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(socialFeed).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SocialFeed', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SocialFeed', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SocialFeed', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSocialFeedToCollectionIfMissing', () => {
      it('should add a SocialFeed to an empty array', () => {
        const socialFeed: ISocialFeed = sampleWithRequiredData;
        expectedResult = service.addSocialFeedToCollectionIfMissing([], socialFeed);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialFeed);
      });

      it('should not add a SocialFeed to an array that contains it', () => {
        const socialFeed: ISocialFeed = sampleWithRequiredData;
        const socialFeedCollection: ISocialFeed[] = [
          {
            ...socialFeed,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSocialFeedToCollectionIfMissing(socialFeedCollection, socialFeed);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SocialFeed to an array that doesn't contain it", () => {
        const socialFeed: ISocialFeed = sampleWithRequiredData;
        const socialFeedCollection: ISocialFeed[] = [sampleWithPartialData];
        expectedResult = service.addSocialFeedToCollectionIfMissing(socialFeedCollection, socialFeed);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialFeed);
      });

      it('should add only unique SocialFeed to an array', () => {
        const socialFeedArray: ISocialFeed[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const socialFeedCollection: ISocialFeed[] = [sampleWithRequiredData];
        expectedResult = service.addSocialFeedToCollectionIfMissing(socialFeedCollection, ...socialFeedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const socialFeed: ISocialFeed = sampleWithRequiredData;
        const socialFeed2: ISocialFeed = sampleWithPartialData;
        expectedResult = service.addSocialFeedToCollectionIfMissing([], socialFeed, socialFeed2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(socialFeed);
        expect(expectedResult).toContain(socialFeed2);
      });

      it('should accept null and undefined values', () => {
        const socialFeed: ISocialFeed = sampleWithRequiredData;
        expectedResult = service.addSocialFeedToCollectionIfMissing([], null, socialFeed, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(socialFeed);
      });

      it('should return initial array if no SocialFeed is added', () => {
        const socialFeedCollection: ISocialFeed[] = [sampleWithRequiredData];
        expectedResult = service.addSocialFeedToCollectionIfMissing(socialFeedCollection, undefined, null);
        expect(expectedResult).toEqual(socialFeedCollection);
      });
    });

    describe('compareSocialFeed', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSocialFeed(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSocialFeed(entity1, entity2);
        const compareResult2 = service.compareSocialFeed(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSocialFeed(entity1, entity2);
        const compareResult2 = service.compareSocialFeed(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSocialFeed(entity1, entity2);
        const compareResult2 = service.compareSocialFeed(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
