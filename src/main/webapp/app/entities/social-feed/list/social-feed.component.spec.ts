import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SocialFeedService } from '../service/social-feed.service';

import { SocialFeedComponent } from './social-feed.component';

describe('SocialFeed Management Component', () => {
  let comp: SocialFeedComponent;
  let fixture: ComponentFixture<SocialFeedComponent>;
  let service: SocialFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'social-feed', component: SocialFeedComponent }]), HttpClientTestingModule],
      declarations: [SocialFeedComponent],
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
      .overrideTemplate(SocialFeedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialFeedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SocialFeedService);

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
    expect(comp.socialFeeds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to socialFeedService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSocialFeedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSocialFeedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
