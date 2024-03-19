import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReviewCommentsFormService, ReviewCommentsFormGroup } from './review-comments-form.service';
import { IReviewComments } from '../review-comments.model';
import { ReviewCommentsService } from '../service/review-comments.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-review-comments-update',
  templateUrl: './review-comments-update.component.html',
})
export class ReviewCommentsUpdateComponent implements OnInit {
  isSaving = false;
  reviewComments: IReviewComments | null = null;

  userPagesSharedCollection: IUserPage[] = [];
  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: ReviewCommentsFormGroup = this.reviewCommentsFormService.createReviewCommentsFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected reviewCommentsService: ReviewCommentsService,
    protected reviewCommentsFormService: ReviewCommentsFormService,
    protected userPageService: UserPageService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUserPage = (o1: IUserPage | null, o2: IUserPage | null): boolean => this.userPageService.compareUserPage(o1, o2);

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

    this.userPagesSharedCollection = this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(
      this.userPagesSharedCollection,
      reviewComments.userPage
    );
    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      reviewComments.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userPageService
      .query()
      .pipe(map((res: HttpResponse<IUserPage[]>) => res.body ?? []))
      .pipe(
        map((userPages: IUserPage[]) =>
          this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(userPages, this.reviewComments?.userPage)
        )
      )
      .subscribe((userPages: IUserPage[]) => (this.userPagesSharedCollection = userPages));

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
