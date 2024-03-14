import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewCommentsService } from './review-comments.service';
import { IReviewComments } from '../review-comments.model';

describe('Service Tests', () => {
  describe('ReviewComments Service', () => {
    let service: ReviewCommentsService;
    let httpMock: HttpTestingController;
    let elemDefault: IReviewComments;
    let expectedResult: IReviewComments | IReviewComments[] | boolean | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = undefined;
      service = TestBed.inject(ReviewCommentsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        content: 'AAAAAAA',
        // Add additional fields with default values as required
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(elemDefault);
      });

      it('should create a ReviewComments', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            // Add additional default values if required
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(elemDefault).subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(expected);
      });

      it('should update a ReviewComments', () => {
        const returnedFromService = Object.assign(
          {
            // Mock other fields if required
            content: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toEqual(expected);
      });

      it('should return a list of ReviewComments', () => {
        const returnedFromService = Object.assign(
          {
            content: 'BBBBBB',
            // Mock other fields if required
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toEqual([expected]);
      });

      it('should delete a ReviewComments', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush(null);
        expect(expectedResult).toBe(true);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
