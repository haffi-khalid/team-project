import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';

import { AuthenticationComponent } from './authentication.component';

describe('Authentication Management Component', () => {
  let comp: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'authentication', component: AuthenticationComponent }]), HttpClientTestingModule],
      declarations: [AuthenticationComponent],
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
      .overrideTemplate(AuthenticationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthenticationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AuthenticationService);

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
    expect(comp.authentications?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to authenticationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAuthenticationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAuthenticationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
