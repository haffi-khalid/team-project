import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GroupDonatorCollectorDetailComponent } from './group-donator-collector-detail.component';

describe('GroupDonatorCollector Management Detail Component', () => {
  let comp: GroupDonatorCollectorDetailComponent;
  let fixture: ComponentFixture<GroupDonatorCollectorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDonatorCollectorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ groupDonatorCollector: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GroupDonatorCollectorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GroupDonatorCollectorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load groupDonatorCollector on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.groupDonatorCollector).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
