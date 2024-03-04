import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDonatorPage } from '../donator-page.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../donator-page.test-samples';

import { DonatorPageService } from './donator-page.service';

const requireRestSample: IDonatorPage = {
  ...sampleWithRequiredData,
};

describe('DonatorPage Service', () => {
  let service: DonatorPageService;
  let httpMock: HttpTestingController;
  let expectedResult: IDonatorPage | IDonatorPage[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DonatorPageService);
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

    it('should create a DonatorPage', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const donatorPage = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(donatorPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DonatorPage', () => {
      const donatorPage = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(donatorPage).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DonatorPage', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DonatorPage', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DonatorPage', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDonatorPageToCollectionIfMissing', () => {
      it('should add a DonatorPage to an empty array', () => {
        const donatorPage: IDonatorPage = sampleWithRequiredData;
        expectedResult = service.addDonatorPageToCollectionIfMissing([], donatorPage);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donatorPage);
      });

      it('should not add a DonatorPage to an array that contains it', () => {
        const donatorPage: IDonatorPage = sampleWithRequiredData;
        const donatorPageCollection: IDonatorPage[] = [
          {
            ...donatorPage,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDonatorPageToCollectionIfMissing(donatorPageCollection, donatorPage);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DonatorPage to an array that doesn't contain it", () => {
        const donatorPage: IDonatorPage = sampleWithRequiredData;
        const donatorPageCollection: IDonatorPage[] = [sampleWithPartialData];
        expectedResult = service.addDonatorPageToCollectionIfMissing(donatorPageCollection, donatorPage);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donatorPage);
      });

      it('should add only unique DonatorPage to an array', () => {
        const donatorPageArray: IDonatorPage[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const donatorPageCollection: IDonatorPage[] = [sampleWithRequiredData];
        expectedResult = service.addDonatorPageToCollectionIfMissing(donatorPageCollection, ...donatorPageArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const donatorPage: IDonatorPage = sampleWithRequiredData;
        const donatorPage2: IDonatorPage = sampleWithPartialData;
        expectedResult = service.addDonatorPageToCollectionIfMissing([], donatorPage, donatorPage2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(donatorPage);
        expect(expectedResult).toContain(donatorPage2);
      });

      it('should accept null and undefined values', () => {
        const donatorPage: IDonatorPage = sampleWithRequiredData;
        expectedResult = service.addDonatorPageToCollectionIfMissing([], null, donatorPage, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(donatorPage);
      });

      it('should return initial array if no DonatorPage is added', () => {
        const donatorPageCollection: IDonatorPage[] = [sampleWithRequiredData];
        expectedResult = service.addDonatorPageToCollectionIfMissing(donatorPageCollection, undefined, null);
        expect(expectedResult).toEqual(donatorPageCollection);
      });
    });

    describe('compareDonatorPage', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDonatorPage(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDonatorPage(entity1, entity2);
        const compareResult2 = service.compareDonatorPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDonatorPage(entity1, entity2);
        const compareResult2 = service.compareDonatorPage(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDonatorPage(entity1, entity2);
        const compareResult2 = service.compareDonatorPage(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
