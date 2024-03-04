import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserPageDetailComponent } from './user-page-detail.component';

describe('UserPage Management Detail Component', () => {
  let comp: UserPageDetailComponent;
  let fixture: ComponentFixture<UserPageDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserPageDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userPage: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserPageDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserPageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userPage on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userPage).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
