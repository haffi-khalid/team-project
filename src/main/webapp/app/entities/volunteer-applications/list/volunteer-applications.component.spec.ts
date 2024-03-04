import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VolunteerApplicationsService } from '../service/volunteer-applications.service';

import { VolunteerApplicationsComponent } from './volunteer-applications.component';

describe('VolunteerApplications Management Component', () => {
  let comp: VolunteerApplicationsComponent;
  let fixture: ComponentFixture<VolunteerApplicationsComponent>;
  let service: VolunteerApplicationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'volunteer-applications', component: VolunteerApplicationsComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [VolunteerApplicationsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(VolunteerApplicationsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VolunteerApplicationsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VolunteerApplicationsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.volunteerApplications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to volunteerApplicationsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVolunteerApplicationsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVolunteerApplicationsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
