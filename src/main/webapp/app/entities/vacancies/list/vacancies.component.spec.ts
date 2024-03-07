import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VacanciesService } from '../service/vacancies.service';

import { VacanciesComponent } from './vacancies.component';

describe('Vacancies Management Component', () => {
  let comp: VacanciesComponent;
  let fixture: ComponentFixture<VacanciesComponent>;
  let service: VacanciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'vacancies', component: VacanciesComponent }]), HttpClientTestingModule],
      declarations: [VacanciesComponent],
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
      .overrideTemplate(VacanciesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VacanciesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VacanciesService);

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
    expect(comp.vacancies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to vacanciesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVacanciesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVacanciesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
