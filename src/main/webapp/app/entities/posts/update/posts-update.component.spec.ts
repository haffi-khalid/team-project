import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostsFormService } from './posts-form.service';
import { PostsService } from '../service/posts.service';
import { IPosts } from '../posts.model';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

import { PostsUpdateComponent } from './posts-update.component';

describe('Posts Management Update Component', () => {
  let comp: PostsUpdateComponent;
  let fixture: ComponentFixture<PostsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postsFormService: PostsFormService;
  let postsService: PostsService;
  let socialFeedService: SocialFeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostsUpdateComponent],
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
      .overrideTemplate(PostsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postsFormService = TestBed.inject(PostsFormService);
    postsService = TestBed.inject(PostsService);
    socialFeedService = TestBed.inject(SocialFeedService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call SocialFeed query and add missing value', () => {
      const posts: IPosts = { id: 456 };
      const socialFeed: ISocialFeed = { id: 73441 };
      posts.socialFeed = socialFeed;

      const socialFeedCollection: ISocialFeed[] = [{ id: 83882 }];
      jest.spyOn(socialFeedService, 'query').mockReturnValue(of(new HttpResponse({ body: socialFeedCollection })));
      const additionalSocialFeeds = [socialFeed];
      const expectedCollection: ISocialFeed[] = [...additionalSocialFeeds, ...socialFeedCollection];
      jest.spyOn(socialFeedService, 'addSocialFeedToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      expect(socialFeedService.query).toHaveBeenCalled();
      expect(socialFeedService.addSocialFeedToCollectionIfMissing).toHaveBeenCalledWith(
        socialFeedCollection,
        ...additionalSocialFeeds.map(expect.objectContaining)
      );
      expect(comp.socialFeedsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const posts: IPosts = { id: 456 };
      const socialFeed: ISocialFeed = { id: 91387 };
      posts.socialFeed = socialFeed;

      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      expect(comp.socialFeedsSharedCollection).toContain(socialFeed);
      expect(comp.posts).toEqual(posts);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosts>>();
      const posts = { id: 123 };
      jest.spyOn(postsFormService, 'getPosts').mockReturnValue(posts);
      jest.spyOn(postsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posts }));
      saveSubject.complete();

      // THEN
      expect(postsFormService.getPosts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(postsService.update).toHaveBeenCalledWith(expect.objectContaining(posts));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosts>>();
      const posts = { id: 123 };
      jest.spyOn(postsFormService, 'getPosts').mockReturnValue({ id: null });
      jest.spyOn(postsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posts }));
      saveSubject.complete();

      // THEN
      expect(postsFormService.getPosts).toHaveBeenCalled();
      expect(postsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPosts>>();
      const posts = { id: 123 };
      jest.spyOn(postsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSocialFeed', () => {
      it('Should forward to socialFeedService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(socialFeedService, 'compareSocialFeed');
        comp.compareSocialFeed(entity, entity2);
        expect(socialFeedService.compareSocialFeed).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
