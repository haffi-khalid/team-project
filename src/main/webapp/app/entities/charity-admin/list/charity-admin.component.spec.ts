import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharityAdminService } from '../service/charity-admin.service';

import { CharityAdminComponent } from './charity-admin.component';

describe('CharityAdmin Management Component', () => {
  let comp: CharityAdminComponent;
  let fixture: ComponentFixture<CharityAdminComponent>;
  let service: CharityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'charity-admin', component: CharityAdminComponent }]), HttpClientTestingModule],
      declarations: [CharityAdminComponent],
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
      .overrideTemplate(CharityAdminComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityAdminComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CharityAdminService);

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
    expect(comp.charityAdmins?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to charityAdminService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCharityAdminIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCharityAdminIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
