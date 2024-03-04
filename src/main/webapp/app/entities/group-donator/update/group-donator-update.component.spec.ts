import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GroupDonatorFormService } from './group-donator-form.service';
import { GroupDonatorService } from '../service/group-donator.service';
import { IGroupDonator } from '../group-donator.model';
import { IDonatorPage } from 'app/entities/donator-page/donator-page.model';
import { DonatorPageService } from 'app/entities/donator-page/service/donator-page.service';
import { ICharityEvent } from 'app/entities/charity-event/charity-event.model';
import { CharityEventService } from 'app/entities/charity-event/service/charity-event.service';

import { GroupDonatorUpdateComponent } from './group-donator-update.component';

describe('GroupDonator Management Update Component', () => {
  let comp: GroupDonatorUpdateComponent;
  let fixture: ComponentFixture<GroupDonatorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let groupDonatorFormService: GroupDonatorFormService;
  let groupDonatorService: GroupDonatorService;
  let donatorPageService: DonatorPageService;
  let charityEventService: CharityEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GroupDonatorUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GroupDonatorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupDonatorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    groupDonatorFormService = TestBed.inject(GroupDonatorFormService);
    groupDonatorService = TestBed.inject(GroupDonatorService);
    donatorPageService = TestBed.inject(DonatorPageService);
    charityEventService = TestBed.inject(CharityEventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call donatorPage query and add missing value', () => {
      const groupDonator: IGroupDonator = { id: 456 };
      const donatorPage: IDonatorPage = { id: 7666 };
      groupDonator.donatorPage = donatorPage;

      const donatorPageCollection: IDonatorPage[] = [{ id: 98233 }];
      jest.spyOn(donatorPageService, 'query').mockReturnValue(of(new HttpResponse({ body: donatorPageCollection })));
      const expectedCollection: IDonatorPage[] = [donatorPage, ...donatorPageCollection];
      jest.spyOn(donatorPageService, 'addDonatorPageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ groupDonator });
      comp.ngOnInit();

      expect(donatorPageService.query).toHaveBeenCalled();
      expect(donatorPageService.addDonatorPageToCollectionIfMissing).toHaveBeenCalledWith(donatorPageCollection, donatorPage);
      expect(comp.donatorPagesCollection).toEqual(expectedCollection);
    });

    it('Should call CharityEvent query and add missing value', () => {
      const groupDonator: IGroupDonator = { id: 456 };
      const charityEvent: ICharityEvent = { id: 72764 };
      groupDonator.charityEvent = charityEvent;

      const charityEventCollection: ICharityEvent[] = [{ id: 50205 }];
      jest.spyOn(charityEventService, 'query').mockReturnValue(of(new HttpResponse({ body: charityEventCollection })));
      const additionalCharityEvents = [charityEvent];
      const expectedCollection: ICharityEvent[] = [...additionalCharityEvents, ...charityEventCollection];
      jest.spyOn(charityEventService, 'addCharityEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ groupDonator });
      comp.ngOnInit();

      expect(charityEventService.query).toHaveBeenCalled();
      expect(charityEventService.addCharityEventToCollectionIfMissing).toHaveBeenCalledWith(
        charityEventCollection,
        ...additionalCharityEvents.map(expect.objectContaining)
      );
      expect(comp.charityEventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const groupDonator: IGroupDonator = { id: 456 };
      const donatorPage: IDonatorPage = { id: 92401 };
      groupDonator.donatorPage = donatorPage;
      const charityEvent: ICharityEvent = { id: 76629 };
      groupDonator.charityEvent = charityEvent;

      activatedRoute.data = of({ groupDonator });
      comp.ngOnInit();

      expect(comp.donatorPagesCollection).toContain(donatorPage);
      expect(comp.charityEventsSharedCollection).toContain(charityEvent);
      expect(comp.groupDonator).toEqual(groupDonator);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonator>>();
      const groupDonator = { id: 123 };
      jest.spyOn(groupDonatorFormService, 'getGroupDonator').mockReturnValue(groupDonator);
      jest.spyOn(groupDonatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupDonator }));
      saveSubject.complete();

      // THEN
      expect(groupDonatorFormService.getGroupDonator).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(groupDonatorService.update).toHaveBeenCalledWith(expect.objectContaining(groupDonator));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonator>>();
      const groupDonator = { id: 123 };
      jest.spyOn(groupDonatorFormService, 'getGroupDonator').mockReturnValue({ id: null });
      jest.spyOn(groupDonatorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonator: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupDonator }));
      saveSubject.complete();

      // THEN
      expect(groupDonatorFormService.getGroupDonator).toHaveBeenCalled();
      expect(groupDonatorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupDonator>>();
      const groupDonator = { id: 123 };
      jest.spyOn(groupDonatorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupDonator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(groupDonatorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDonatorPage', () => {
      it('Should forward to donatorPageService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(donatorPageService, 'compareDonatorPage');
        comp.compareDonatorPage(entity, entity2);
        expect(donatorPageService.compareDonatorPage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCharityEvent', () => {
      it('Should forward to charityEventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityEventService, 'compareCharityEvent');
        comp.compareCharityEvent(entity, entity2);
        expect(charityEventService.compareCharityEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
