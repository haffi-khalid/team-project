import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CharityDetailComponent } from './charity-detail.component';

describe('Charity Management Detail Component', () => {
  let comp: CharityDetailComponent;
  let fixture: ComponentFixture<CharityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ charity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CharityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CharityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load charity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.charity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
