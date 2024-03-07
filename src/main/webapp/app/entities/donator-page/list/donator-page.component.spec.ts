import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DonatorPageService } from '../service/donator-page.service';

import { DonatorPageComponent } from './donator-page.component';

describe('DonatorPage Management Component', () => {
  let comp: DonatorPageComponent;
  let fixture: ComponentFixture<DonatorPageComponent>;
  let service: DonatorPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'donator-page', component: DonatorPageComponent }]), HttpClientTestingModule],
      declarations: [DonatorPageComponent],
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
      .overrideTemplate(DonatorPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonatorPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DonatorPageService);

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
    expect(comp.donatorPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to donatorPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDonatorPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDonatorPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
