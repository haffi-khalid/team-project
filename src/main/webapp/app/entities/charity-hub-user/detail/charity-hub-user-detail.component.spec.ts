import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CharityHubUserDetailComponent } from './charity-hub-user-detail.component';

describe('CharityHubUser Management Detail Component', () => {
  let comp: CharityHubUserDetailComponent;
  let fixture: ComponentFixture<CharityHubUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharityHubUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ charityHubUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CharityHubUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CharityHubUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load charityHubUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.charityHubUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
