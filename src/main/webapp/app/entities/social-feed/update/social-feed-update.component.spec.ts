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

import { SocialFeedUpdateComponent } from './social-feed-update.component';

describe('SocialFeed Management Update Component', () => {
  let comp: SocialFeedUpdateComponent;
  let fixture: ComponentFixture<SocialFeedUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let socialFeedFormService: SocialFeedFormService;
  let socialFeedService: SocialFeedService;

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

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const socialFeed: ISocialFeed = { id: 456 };

      activatedRoute.data = of({ socialFeed });
      comp.ngOnInit();

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
});
