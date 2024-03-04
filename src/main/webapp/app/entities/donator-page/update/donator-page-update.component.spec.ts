import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DonatorPageFormService } from './donator-page-form.service';
import { DonatorPageService } from '../service/donator-page.service';
import { IDonatorPage } from '../donator-page.model';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

import { DonatorPageUpdateComponent } from './donator-page-update.component';

describe('DonatorPage Management Update Component', () => {
  let comp: DonatorPageUpdateComponent;
  let fixture: ComponentFixture<DonatorPageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let donatorPageFormService: DonatorPageFormService;
  let donatorPageService: DonatorPageService;
  let charityProfileService: CharityProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DonatorPageUpdateComponent],
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
      .overrideTemplate(DonatorPageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DonatorPageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    donatorPageFormService = TestBed.inject(DonatorPageFormService);
    donatorPageService = TestBed.inject(DonatorPageService);
    charityProfileService = TestBed.inject(CharityProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CharityProfile query and add missing value', () => {
      const donatorPage: IDonatorPage = { id: 456 };
      const charityProfile: ICharityProfile = { id: 93241 };
      donatorPage.charityProfile = charityProfile;

      const charityProfileCollection: ICharityProfile[] = [{ id: 43838 }];
      jest.spyOn(charityProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: charityProfileCollection })));
      const additionalCharityProfiles = [charityProfile];
      const expectedCollection: ICharityProfile[] = [...additionalCharityProfiles, ...charityProfileCollection];
      jest.spyOn(charityProfileService, 'addCharityProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ donatorPage });
      comp.ngOnInit();

      expect(charityProfileService.query).toHaveBeenCalled();
      expect(charityProfileService.addCharityProfileToCollectionIfMissing).toHaveBeenCalledWith(
        charityProfileCollection,
        ...additionalCharityProfiles.map(expect.objectContaining)
      );
      expect(comp.charityProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const donatorPage: IDonatorPage = { id: 456 };
      const charityProfile: ICharityProfile = { id: 82999 };
      donatorPage.charityProfile = charityProfile;

      activatedRoute.data = of({ donatorPage });
      comp.ngOnInit();

      expect(comp.charityProfilesSharedCollection).toContain(charityProfile);
      expect(comp.donatorPage).toEqual(donatorPage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDonatorPage>>();
      const donatorPage = { id: 123 };
      jest.spyOn(donatorPageFormService, 'getDonatorPage').mockReturnValue(donatorPage);
      jest.spyOn(donatorPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donatorPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donatorPage }));
      saveSubject.complete();

      // THEN
      expect(donatorPageFormService.getDonatorPage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(donatorPageService.update).toHaveBeenCalledWith(expect.objectContaining(donatorPage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDonatorPage>>();
      const donatorPage = { id: 123 };
      jest.spyOn(donatorPageFormService, 'getDonatorPage').mockReturnValue({ id: null });
      jest.spyOn(donatorPageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donatorPage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: donatorPage }));
      saveSubject.complete();

      // THEN
      expect(donatorPageFormService.getDonatorPage).toHaveBeenCalled();
      expect(donatorPageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDonatorPage>>();
      const donatorPage = { id: 123 };
      jest.spyOn(donatorPageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ donatorPage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(donatorPageService.update).toHaveBeenCalled();
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
