import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CharityHubUserService } from '../service/charity-hub-user.service';

import { CharityHubUserComponent } from './charity-hub-user.component';

describe('CharityHubUser Management Component', () => {
  let comp: CharityHubUserComponent;
  let fixture: ComponentFixture<CharityHubUserComponent>;
  let service: CharityHubUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'charity-hub-user', component: CharityHubUserComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [CharityHubUserComponent],
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
      .overrideTemplate(CharityHubUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityHubUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CharityHubUserService);

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
    expect(comp.charityHubUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to charityHubUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCharityHubUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCharityHubUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
