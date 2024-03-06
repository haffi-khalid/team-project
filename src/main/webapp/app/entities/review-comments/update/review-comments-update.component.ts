import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReviewCommentsFormService, ReviewCommentsFormGroup } from './review-comments-form.service';
import { IReviewComments } from '../review-comments.model';
import { ReviewCommentsService } from '../service/review-comments.service';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-review-comments-update',
  templateUrl: './review-comments-update.component.html',
})
export class ReviewCommentsUpdateComponent implements OnInit {
  isSaving = false;
  reviewComments: IReviewComments | null = null;

  charityHubUsersSharedCollection: ICharityHubUser[] = [];
  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: ReviewCommentsFormGroup = this.reviewCommentsFormService.createReviewCommentsFormGroup();

  constructor(
    protected reviewCommentsService: ReviewCommentsService,
    protected reviewCommentsFormService: ReviewCommentsFormService,
    protected charityHubUserService: CharityHubUserService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityHubUser = (o1: ICharityHubUser | null, o2: ICharityHubUser | null): boolean =>
    this.charityHubUserService.compareCharityHubUser(o1, o2);

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reviewComments }) => {
      this.reviewComments = reviewComments;
      if (reviewComments) {
        this.updateForm(reviewComments);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reviewComments = this.reviewCommentsFormService.getReviewComments(this.editForm);
    if (reviewComments.id !== null) {
      this.subscribeToSaveResponse(this.reviewCommentsService.update(reviewComments));
    } else {
      this.subscribeToSaveResponse(this.reviewCommentsService.create(reviewComments));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReviewComments>>): void {
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

  protected updateForm(reviewComments: IReviewComments): void {
    this.reviewComments = reviewComments;
    this.reviewCommentsFormService.resetForm(this.editForm, reviewComments);

    this.charityHubUsersSharedCollection = this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
      this.charityHubUsersSharedCollection,
      reviewComments.charityHubUser
    );
    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      reviewComments.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityHubUserService
      .query()
      .pipe(map((res: HttpResponse<ICharityHubUser[]>) => res.body ?? []))
      .pipe(
        map((charityHubUsers: ICharityHubUser[]) =>
          this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
            charityHubUsers,
            this.reviewComments?.charityHubUser
          )
        )
      )
      .subscribe((charityHubUsers: ICharityHubUser[]) => (this.charityHubUsersSharedCollection = charityHubUsers));

    this.charityProfileService
      .query()
      .pipe(map((res: HttpResponse<ICharityProfile[]>) => res.body ?? []))
      .pipe(
        map((charityProfiles: ICharityProfile[]) =>
          this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
            charityProfiles,
            this.reviewComments?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
