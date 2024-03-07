import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ApprovedVolunteersDetailComponent } from './approved-volunteers-detail.component';

describe('ApprovedVolunteers Management Detail Component', () => {
  let comp: ApprovedVolunteersDetailComponent;
  let fixture: ComponentFixture<ApprovedVolunteersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedVolunteersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ approvedVolunteers: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ApprovedVolunteersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ApprovedVolunteersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load approvedVolunteers on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.approvedVolunteers).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
