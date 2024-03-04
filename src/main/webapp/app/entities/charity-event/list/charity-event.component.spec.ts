import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharityEventService } from '../service/charity-event.service';

import { CharityEventComponent } from './charity-event.component';

describe('CharityEvent Management Component', () => {
  let comp: CharityEventComponent;
  let fixture: ComponentFixture<CharityEventComponent>;
  let service: CharityEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'charity-event', component: CharityEventComponent }]), HttpClientTestingModule],
      declarations: [CharityEventComponent],
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
      .overrideTemplate(CharityEventComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityEventComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CharityEventService);

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
    expect(comp.charityEvents?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to charityEventService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCharityEventIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCharityEventIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
