import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PostsFormService, PostsFormGroup } from './posts-form.service';
import { IPosts } from '../posts.model';
import { PostsService } from '../service/posts.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

@Component({
  selector: 'jhi-posts-update',
  templateUrl: './posts-update.component.html',
})
export class PostsUpdateComponent implements OnInit {
  isSaving = false;
  posts: IPosts | null = null;

  socialFeedsSharedCollection: ISocialFeed[] = [];

  editForm: PostsFormGroup = this.postsFormService.createPostsFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected postsService: PostsService,
    protected postsFormService: PostsFormService,
    protected socialFeedService: SocialFeedService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSocialFeed = (o1: ISocialFeed | null, o2: ISocialFeed | null): boolean => this.socialFeedService.compareSocialFeed(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ posts }) => {
      this.posts = posts;
      if (posts) {
        this.updateForm(posts);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const posts = this.postsFormService.getPosts(this.editForm);
    if (posts.id !== null) {
      this.subscribeToSaveResponse(this.postsService.update(posts));
    } else {
      this.subscribeToSaveResponse(this.postsService.create(posts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPosts>>): void {
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

  protected updateForm(posts: IPosts): void {
    this.posts = posts;
    this.postsFormService.resetForm(this.editForm, posts);

    this.socialFeedsSharedCollection = this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(
      this.socialFeedsSharedCollection,
      posts.socialFeed
    );
  }

  protected loadRelationshipsOptions(): void {
    this.socialFeedService
      .query()
      .pipe(map((res: HttpResponse<ISocialFeed[]>) => res.body ?? []))
      .pipe(
        map((socialFeeds: ISocialFeed[]) =>
          this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(socialFeeds, this.posts?.socialFeed)
        )
      )
      .subscribe((socialFeeds: ISocialFeed[]) => (this.socialFeedsSharedCollection = socialFeeds));
  }
}
