import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FundraisingIdeaFormService } from './fundraising-idea-form.service';
import { FundraisingIdeaService } from '../service/fundraising-idea.service';
import { IFundraisingIdea } from '../fundraising-idea.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { FundraisingIdeaUpdateComponent } from './fundraising-idea-update.component';

describe('FundraisingIdea Management Update Component', () => {
  let comp: FundraisingIdeaUpdateComponent;
  let fixture: ComponentFixture<FundraisingIdeaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fundraisingIdeaFormService: FundraisingIdeaFormService;
  let fundraisingIdeaService: FundraisingIdeaService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FundraisingIdeaUpdateComponent],
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
      .overrideTemplate(FundraisingIdeaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FundraisingIdeaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fundraisingIdeaFormService = TestBed.inject(FundraisingIdeaFormService);
    fundraisingIdeaService = TestBed.inject(FundraisingIdeaService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityProfile query and add missing value', () => {
      const fundraisingIdea: IFundraisingIdea = { id: 456 };
      const charityProfile: ICharityProfile = { id: 92567 };
      fundraisingIdea.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 71887 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const fundraisingIdea: IFundraisingIdea = { id: 456 };
      const charityProfile: ICharityProfile = { id: 13167 };
      fundraisingIdea.charityProfile = charityProfile;

      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.fundraisingIdea).toEqual(fundraisingIdea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaFormService, 'getFundraisingIdea').mockReturnValue(fundraisingIdea);
      jest.spyOn(fundraisingIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fundraisingIdea }));
      saveSubject.complete();

      // THEN
      expect(fundraisingIdeaFormService.getFundraisingIdea).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(fundraisingIdeaService.update).toHaveBeenCalledWith(expect.objectContaining(fundraisingIdea));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaFormService, 'getFundraisingIdea').mockReturnValue({ id: null });
      jest.spyOn(fundraisingIdeaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fundraisingIdea }));
      saveSubject.complete();

      // THEN
      expect(fundraisingIdeaFormService.getFundraisingIdea).toHaveBeenCalled();
      expect(fundraisingIdeaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFundraisingIdea>>();
      const fundraisingIdea = { id: 123 };
      jest.spyOn(fundraisingIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fundraisingIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fundraisingIdeaService.update).toHaveBeenCalled();
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
