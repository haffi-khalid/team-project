import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PostFormService, PostFormGroup } from './post-form.service';
import { IPost } from '../post.model';
import { PostService } from '../service/post.service';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

@Component({
  selector: 'jhi-post-update',
  templateUrl: './post-update.component.html',
})
export class PostUpdateComponent implements OnInit {
  isSaving = false;
  post: IPost | null = null;

  socialFeedsSharedCollection: ISocialFeed[] = [];

  editForm: PostFormGroup = this.postFormService.createPostFormGroup();

  constructor(
    protected postService: PostService,
    protected postFormService: PostFormService,
    protected socialFeedService: SocialFeedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSocialFeed = (o1: ISocialFeed | null, o2: ISocialFeed | null): boolean => this.socialFeedService.compareSocialFeed(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ post }) => {
      this.post = post;
      if (post) {
        this.updateForm(post);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const post = this.postFormService.getPost(this.editForm);
    if (post.id !== null) {
      this.subscribeToSaveResponse(this.postService.update(post));
    } else {
      this.subscribeToSaveResponse(this.postService.create(post));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPost>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(post: IPost): void {
    this.post = post;
    this.postFormService.resetForm(this.editForm, post);

    this.socialFeedsSharedCollection = this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(
      this.socialFeedsSharedCollection,
      post.socialFeed
    );
  }

  protected loadRelationshipsOptions(): void {
    this.socialFeedService
      .query()
      .pipe(map((res: HttpResponse<ISocialFeed[]>) => res.body ?? []))
      .pipe(
        map((socialFeeds: ISocialFeed[]) =>
          this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(socialFeeds, this.post?.socialFeed)
        )
      )
      .subscribe((socialFeeds: ISocialFeed[]) => (this.socialFeedsSharedCollection = socialFeeds));
  }
}
