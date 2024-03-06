import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DonatorPageDetailComponent } from './donator-page-detail.component';

describe('DonatorPage Management Detail Component', () => {
  let comp: DonatorPageDetailComponent;
  let fixture: ComponentFixture<DonatorPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonatorPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ donatorPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DonatorPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DonatorPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load donatorPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.donatorPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
