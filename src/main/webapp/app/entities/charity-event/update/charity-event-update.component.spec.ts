import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CharityEventFormService } from './charity-event-form.service';
import { CharityEventService } from '../service/charity-event.service';
import { ICharityEvent } from '../charity-event.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { CharityEventUpdateComponent } from './charity-event-update.component';

describe('CharityEvent Management Update Component', () => {
  let comp: CharityEventUpdateComponent;
  let fixture: ComponentFixture<CharityEventUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let charityEventFormService: CharityEventFormService;
  let charityEventService: CharityEventService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CharityEventUpdateComponent],
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
      .overrideTemplate(CharityEventUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CharityEventUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    charityEventFormService = TestBed.inject(CharityEventFormService);
    charityEventService = TestBed.inject(CharityEventService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityProfile query and add missing value', () => {
      const charityEvent: ICharityEvent = { id: 456 };
      const charityProfile: ICharityProfile = { id: 94259 };
      charityEvent.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 92747 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const charityEvent: ICharityEvent = { id: 456 };
      const charityProfile: ICharityProfile = { id: 30352 };
      charityEvent.charityProfile = charityProfile;

      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.charityEvent).toEqual(charityEvent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventFormService, 'getCharityEvent').mockReturnValue(charityEvent);
      jest.spyOn(charityEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityEvent }));
      saveSubject.complete();

      // THEN
      expect(charityEventFormService.getCharityEvent).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(charityEventService.update).toHaveBeenCalledWith(expect.objectContaining(charityEvent));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventFormService, 'getCharityEvent').mockReturnValue({ id: null });
      jest.spyOn(charityEventService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: charityEvent }));
      saveSubject.complete();

      // THEN
      expect(charityEventFormService.getCharityEvent).toHaveBeenCalled();
      expect(charityEventService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICharityEvent>>();
      const charityEvent = { id: 123 };
      jest.spyOn(charityEventService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ charityEvent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(charityEventService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCharityProfile', () => {
      it('Should forward to charityProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityProfileService, 'compareCharityProfile');
        comp.compareCharityProfile(entity, entity2);
        expect(charityProfileService.compareCharityProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
