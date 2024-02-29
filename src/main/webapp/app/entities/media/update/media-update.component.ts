import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MediaFormService, MediaFormGroup } from './media-form.service';
import { IMedia } from '../media.model';
import { MediaService } from '../service/media.service';
import { IPost } from 'app/entities/post/post.model';
import { PostService } from 'app/entities/post/service/post.service';

@Component({
  selector: 'jhi-media-update',
  templateUrl: './media-update.component.html',
})
export class MediaUpdateComponent implements OnInit {
  isSaving = false;
  media: IMedia | null = null;

  postsSharedCollection: IPost[] = [];

  editForm: MediaFormGroup = this.mediaFormService.createMediaFormGroup();

  constructor(
    protected mediaService: MediaService,
    protected mediaFormService: MediaFormService,
    protected postService: PostService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePost = (o1: IPost | null, o2: IPost | null): boolean => this.postService.comparePost(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ media }) => {
      this.media = media;
      if (media) {
        this.updateForm(media);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const media = this.mediaFormService.getMedia(this.editForm);
    if (media.id !== null) {
      this.subscribeToSaveResponse(this.mediaService.update(media));
    } else {
      this.subscribeToSaveResponse(this.mediaService.create(media));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedia>>): void {
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

  protected updateForm(media: IMedia): void {
    this.media = media;
    this.mediaFormService.resetForm(this.editForm, media);

    this.postsSharedCollection = this.postService.addPostToCollectionIfMissing<IPost>(this.postsSharedCollection, media.post);
  }

  protected loadRelationshipsOptions(): void {
    this.postService
      .query()
      .pipe(map((res: HttpResponse<IPost[]>) => res.body ?? []))
      .pipe(map((posts: IPost[]) => this.postService.addPostToCollectionIfMissing<IPost>(posts, this.media?.post)))
      .subscribe((posts: IPost[]) => (this.postsSharedCollection = posts));
  }
}
