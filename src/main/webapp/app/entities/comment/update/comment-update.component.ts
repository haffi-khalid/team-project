import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommentFormService, CommentFormGroup } from './comment-form.service';
import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { ICharity } from 'app/entities/charity/charity.model';
import { CharityService } from 'app/entities/charity/service/charity.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

@Component({
  selector: 'jhi-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;

  commentsSharedCollection: IComment[] = [];
  charitiesSharedCollection: ICharity[] = [];
  userProfilesSharedCollection: IUserProfile[] = [];

  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  constructor(
    protected commentService: CommentService,
    protected commentFormService: CommentFormService,
    protected charityService: CharityService,
    protected userProfileService: UserProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareComment = (o1: IComment | null, o2: IComment | null): boolean => this.commentService.compareComment(o1, o2);

  compareCharity = (o1: ICharity | null, o2: ICharity | null): boolean => this.charityService.compareCharity(o1, o2);

  compareUserProfile = (o1: IUserProfile | null, o2: IUserProfile | null): boolean => this.userProfileService.compareUserProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
      this.commentsSharedCollection,
      comment.commentID
    );
    this.charitiesSharedCollection = this.charityService.addCharityToCollectionIfMissing<ICharity>(
      this.charitiesSharedCollection,
      comment.charityID
    );
    this.userProfilesSharedCollection = this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(
      this.userProfilesSharedCollection,
      comment.userProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.comment?.commentID)))
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));

    this.charityService
      .query()
      .pipe(map((res: HttpResponse<ICharity[]>) => res.body ?? []))
      .pipe(
        map((charities: ICharity[]) => this.charityService.addCharityToCollectionIfMissing<ICharity>(charities, this.comment?.charityID))
      )
      .subscribe((charities: ICharity[]) => (this.charitiesSharedCollection = charities));

    this.userProfileService
      .query()
      .pipe(map((res: HttpResponse<IUserProfile[]>) => res.body ?? []))
      .pipe(
        map((userProfiles: IUserProfile[]) =>
          this.userProfileService.addUserProfileToCollectionIfMissing<IUserProfile>(userProfiles, this.comment?.userProfile)
        )
      )
      .subscribe((userProfiles: IUserProfile[]) => (this.userProfilesSharedCollection = userProfiles));
  }
}
