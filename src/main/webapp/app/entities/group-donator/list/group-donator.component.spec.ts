import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GroupDonatorService } from '../service/group-donator.service';

import { GroupDonatorComponent } from './group-donator.component';

describe('GroupDonator Management Component', () => {
  let comp: GroupDonatorComponent;
  let fixture: ComponentFixture<GroupDonatorComponent>;
  let service: GroupDonatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'group-donator', component: GroupDonatorComponent }]), HttpClientTestingModule],
      declarations: [GroupDonatorComponent],
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
      .overrideTemplate(GroupDonatorComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupDonatorComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GroupDonatorService);

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
    expect(comp.groupDonators?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to groupDonatorService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGroupDonatorIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGroupDonatorIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
