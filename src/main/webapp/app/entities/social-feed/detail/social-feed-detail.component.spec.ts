import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SocialFeedDetailComponent } from './social-feed-detail.component';

describe('SocialFeed Management Detail Component', () => {
  let comp: SocialFeedDetailComponent;
  let fixture: ComponentFixture<SocialFeedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialFeedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ socialFeed: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SocialFeedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SocialFeedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load socialFeed on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.socialFeed).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
