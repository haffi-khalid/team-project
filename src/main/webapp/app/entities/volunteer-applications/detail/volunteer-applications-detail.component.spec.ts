import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VolunteerApplicationsDetailComponent } from './volunteer-applications-detail.component';

describe('VolunteerApplications Management Detail Component', () => {
  let comp: VolunteerApplicationsDetailComponent;
  let fixture: ComponentFixture<VolunteerApplicationsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolunteerApplicationsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ volunteerApplications: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VolunteerApplicationsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VolunteerApplicationsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load volunteerApplications on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.volunteerApplications).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
