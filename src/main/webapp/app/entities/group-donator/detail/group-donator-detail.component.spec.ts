import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GroupDonatorDetailComponent } from './group-donator-detail.component';

describe('GroupDonator Management Detail Component', () => {
  let comp: GroupDonatorDetailComponent;
  let fixture: ComponentFixture<GroupDonatorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDonatorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ groupDonator: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GroupDonatorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GroupDonatorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load groupDonator on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.groupDonator).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
