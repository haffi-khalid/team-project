import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityProfileFormService, CharityProfileFormGroup } from './charity-profile-form.service';
import { ICharityProfile } from '../charity-profile.model';
import { CharityProfileService } from '../service/charity-profile.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISocialFeed } from 'app/entities/social-feed/social-feed.model';
import { SocialFeedService } from 'app/entities/social-feed/service/social-feed.service';

@Component({
  selector: 'jhi-charity-profile-update',
  templateUrl: './charity-profile-update.component.html',
})
export class CharityProfileUpdateComponent implements OnInit {
  isSaving = false;
  charityProfile: ICharityProfile | null = null;

  socialFeedsCollection: ISocialFeed[] = [];

  editForm: CharityProfileFormGroup = this.charityProfileFormService.createCharityProfileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected charityProfileService: CharityProfileService,
    protected charityProfileFormService: CharityProfileFormService,
    protected socialFeedService: SocialFeedService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSocialFeed = (o1: ISocialFeed | null, o2: ISocialFeed | null): boolean => this.socialFeedService.compareSocialFeed(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityProfile }) => {
      this.charityProfile = charityProfile;
      if (charityProfile) {
        this.updateForm(charityProfile);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charityProfile = this.charityProfileFormService.getCharityProfile(this.editForm);
    if (charityProfile.id !== null) {
      this.subscribeToSaveResponse(this.charityProfileService.update(charityProfile));
    } else {
      this.subscribeToSaveResponse(this.charityProfileService.create(charityProfile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityProfile>>): void {
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

  protected updateForm(charityProfile: ICharityProfile): void {
    this.charityProfile = charityProfile;
    this.charityProfileFormService.resetForm(this.editForm, charityProfile);

    this.socialFeedsCollection = this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(
      this.socialFeedsCollection,
      charityProfile.socialFeed
    );
  }

  protected loadRelationshipsOptions(): void {
    this.socialFeedService
      .query({ filter: 'charityprofile-is-null' })
      .pipe(map((res: HttpResponse<ISocialFeed[]>) => res.body ?? []))
      .pipe(
        map((socialFeeds: ISocialFeed[]) =>
          this.socialFeedService.addSocialFeedToCollectionIfMissing<ISocialFeed>(socialFeeds, this.charityProfile?.socialFeed)
        )
      )
      .subscribe((socialFeeds: ISocialFeed[]) => (this.socialFeedsCollection = socialFeeds));
  }
}
