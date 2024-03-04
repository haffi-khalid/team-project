import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FundraisingIdeaService } from '../service/fundraising-idea.service';

import { FundraisingIdeaComponent } from './fundraising-idea.component';

describe('FundraisingIdea Management Component', () => {
  let comp: FundraisingIdeaComponent;
  let fixture: ComponentFixture<FundraisingIdeaComponent>;
  let service: FundraisingIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'fundraising-idea', component: FundraisingIdeaComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [FundraisingIdeaComponent],
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
      .overrideTemplate(FundraisingIdeaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FundraisingIdeaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FundraisingIdeaService);

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
    expect(comp.fundraisingIdeas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to fundraisingIdeaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFundraisingIdeaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFundraisingIdeaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
