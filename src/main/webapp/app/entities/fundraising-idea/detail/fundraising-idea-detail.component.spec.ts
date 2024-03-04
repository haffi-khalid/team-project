import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FundraisingIdeaDetailComponent } from './fundraising-idea-detail.component';

describe('FundraisingIdea Management Detail Component', () => {
  let comp: FundraisingIdeaDetailComponent;
  let fixture: ComponentFixture<FundraisingIdeaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FundraisingIdeaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fundraisingIdea: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FundraisingIdeaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FundraisingIdeaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fundraisingIdea on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fundraisingIdea).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
