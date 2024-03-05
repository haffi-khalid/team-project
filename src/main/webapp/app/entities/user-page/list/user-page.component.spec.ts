import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserPageService } from '../service/user-page.service';

import { UserPageComponent } from './user-page.component';

describe('UserPage Management Component', () => {
  let comp: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let service: UserPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-page', component: UserPageComponent }]), HttpClientTestingModule],
      declarations: [UserPageComponent],
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
      .overrideTemplate(UserPageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserPageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserPageService);

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
    expect(comp.userPages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userPageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserPageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserPageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
