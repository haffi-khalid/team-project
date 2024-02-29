import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SocialFeedFormService } from './social-feed-form.service';
import { SocialFeedService } from '../service/social-feed.service';
import { ISocialFeed } from '../social-feed.model';
import { ICharity } from 'app/entities/charity/charity.model';
import { CharityService } from 'app/entities/charity/service/charity.service';

import { SocialFeedUpdateComponent } from './social-feed-update.component';

describe('SocialFeed Management Update Component', () => {
  let comp: SocialFeedUpdateComponent;
  let fixture: ComponentFixture<SocialFeedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let socialFeedFormService: SocialFeedFormService;
  let socialFeedService: SocialFeedService;
  let charityService: CharityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SocialFeedUpdateComponent],
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
      .overrideTemplate(SocialFeedUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SocialFeedUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    socialFeedFormService = TestBed.inject(SocialFeedFormService);
    socialFeedService = TestBed.inject(SocialFeedService);
    charityService = TestBed.inject(CharityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Charity query and add missing value', () => {
      const socialFeed: ISocialFeed = { id: 456 };
      const charity: ICharity = { id: 36501 };
      socialFeed.charity = charity;

      const charityCollection: ICharity[] = [{ id: 15685 }];
      jest.spyOn(charityService, 'query').mockReturnValue(of(new HttpResponse({ body: charityCollection })));
      const additionalCharities = [charity];
      const expectedCollection: ICharity[] = [...additionalCharities, ...charityCollection];
      jest.spyOn(charityService, 'addCharityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ socialFeed });
      comp.ngOnInit();

      expect(charityService.query).toHaveBeenCalled();
      expect(charityService.addCharityToCollectionIfMissing).toHaveBeenCalledWith(
        charityCollection,
        ...additionalCharities.map(expect.objectContaining)
      );
      expect(comp.charitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const socialFeed: ISocialFeed = { id: 456 };
      const charity: ICharity = { id: 59635 };
      socialFeed.charity = charity;

      activatedRoute.data = of({ socialFeed });
      comp.ngOnInit();

      expect(comp.charitiesSharedCollection).toContain(charity);
      expect(comp.socialFeed).toEqual(socialFeed);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialFeed>>();
      const socialFeed = { id: 123 };
      jest.spyOn(socialFeedFormService, 'getSocialFeed').mockReturnValue(socialFeed);
      jest.spyOn(socialFeedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialFeed });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialFeed }));
      saveSubject.complete();

      // THEN
      expect(socialFeedFormService.getSocialFeed).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(socialFeedService.update).toHaveBeenCalledWith(expect.objectContaining(socialFeed));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialFeed>>();
      const socialFeed = { id: 123 };
      jest.spyOn(socialFeedFormService, 'getSocialFeed').mockReturnValue({ id: null });
      jest.spyOn(socialFeedService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialFeed: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: socialFeed }));
      saveSubject.complete();

      // THEN
      expect(socialFeedFormService.getSocialFeed).toHaveBeenCalled();
      expect(socialFeedService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISocialFeed>>();
      const socialFeed = { id: 123 };
      jest.spyOn(socialFeedService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ socialFeed });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(socialFeedService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCharity', () => {
      it('Should forward to charityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(charityService, 'compareCharity');
        comp.compareCharity(entity, entity2);
        expect(charityService.compareCharity).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
