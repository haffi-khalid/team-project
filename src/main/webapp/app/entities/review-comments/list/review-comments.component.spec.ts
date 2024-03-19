import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReviewCommentsService } from '../service/review-comments.service';

import { ReviewCommentsComponent } from './review-comments.component';

describe('ReviewComments Management Component', () => {
  let comp: ReviewCommentsComponent;
  let fixture: ComponentFixture<ReviewCommentsComponent>;
  let service: ReviewCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'review-comments', component: ReviewCommentsComponent }]), HttpClientTestingModule],
      declarations: [ReviewCommentsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ReviewCommentsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReviewCommentsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReviewCommentsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.reviewComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to reviewCommentsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReviewCommentsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReviewCommentsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
