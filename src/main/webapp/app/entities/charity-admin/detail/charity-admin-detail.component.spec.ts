import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CharityAdminDetailComponent } from './charity-admin-detail.component';

describe('CharityAdmin Management Detail Component', () => {
  let comp: CharityAdminDetailComponent;
  let fixture: ComponentFixture<CharityAdminDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharityAdminDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ charityAdmin: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CharityAdminDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CharityAdminDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load charityAdmin on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.charityAdmin).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
