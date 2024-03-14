import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IReviewComments } from '../review-comments.model';
import { ReviewCommentsService } from '../service/review-comments.service';

import { ReviewCommentsRoutingResolveService } from './review-comments-routing-resolve.service';

describe('ReviewComments routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ReviewCommentsRoutingResolveService;
  let service: ReviewCommentsService;
  let resultReviewComments: IReviewComments | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [ReviewCommentsService],
    });
    mockRouter = TestBed.inject(Router);
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
    mockActivatedRouteSnapshot = jasmine.createSpyObj<ActivatedRouteSnapshot>('ActivatedRouteSnapshot', ['params']);
    routingResolveService = TestBed.inject(ReviewCommentsRoutingResolveService);
    service = TestBed.inject(ReviewCommentsService);
    resultReviewComments = undefined;
  });

  describe('resolve', () => {
    it('should return IReviewComments returned by find', () => {
      // GIVEN
      const response = new HttpResponse({ body: { id: 123 } as IReviewComments });
      spyOn(service, 'find').and.returnValue(of(response));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot as any).subscribe(result => {
        resultReviewComments = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultReviewComments).toEqual(jasmine.objectContaining({ id: 123 }));
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot as any).subscribe(result => {
        resultReviewComments = result;
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultReviewComments).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      spyOn(service, 'find').and.returnValue(of(new HttpResponse<IReviewComments>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot as any).subscribe(result => {
        resultReviewComments = result;
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultReviewComments).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
