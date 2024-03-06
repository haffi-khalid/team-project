import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AuthenticationDetailComponent } from './authentication-detail.component';

describe('Authentication Management Detail Component', () => {
  let comp: AuthenticationDetailComponent;
  let fixture: ComponentFixture<AuthenticationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ authentication: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AuthenticationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AuthenticationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load authentication on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.authentication).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
