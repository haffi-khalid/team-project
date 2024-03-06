import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFundraisingIdea } from '../fundraising-idea.model';
import { FundraisingIdeaService } from '../service/fundraising-idea.service';

import { FundraisingIdeaRoutingResolveService } from './fundraising-idea-routing-resolve.service';

describe('FundraisingIdea routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FundraisingIdeaRoutingResolveService;
  let service: FundraisingIdeaService;
  let resultFundraisingIdea: IFundraisingIdea | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(FundraisingIdeaRoutingResolveService);
    service = TestBed.inject(FundraisingIdeaService);
    resultFundraisingIdea = undefined;
  });

  describe('resolve', () => {
    it('should return IFundraisingIdea returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFundraisingIdea = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFundraisingIdea).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFundraisingIdea = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFundraisingIdea).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IFundraisingIdea>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFundraisingIdea = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFundraisingIdea).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
