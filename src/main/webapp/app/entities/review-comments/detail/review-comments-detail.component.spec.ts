import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReviewCommentsDetailComponent } from './review-comments-detail.component';

describe('ReviewComments Management Detail Component', () => {
  let comp: ReviewCommentsDetailComponent;
  let fixture: ComponentFixture<ReviewCommentsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewCommentsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ reviewComments: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReviewCommentsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReviewCommentsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load reviewComments on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.reviewComments).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
