import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FundraisingIdeaFormService, FundraisingIdeaFormGroup } from './fundraising-idea-form.service';
import { IFundraisingIdea } from '../fundraising-idea.model';
import { FundraisingIdeaService } from '../service/fundraising-idea.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

@Component({
  selector: 'jhi-fundraising-idea-update',
  templateUrl: './fundraising-idea-update.component.html',
})
export class FundraisingIdeaUpdateComponent implements OnInit {
  isSaving = false;
  fundraisingIdea: IFundraisingIdea | null = null;
  locationCategoryValues = Object.keys(LocationCategory);

  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: FundraisingIdeaFormGroup = this.fundraisingIdeaFormService.createFundraisingIdeaFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fundraisingIdeaService: FundraisingIdeaService,
    protected fundraisingIdeaFormService: FundraisingIdeaFormService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fundraisingIdea }) => {
      this.fundraisingIdea = fundraisingIdea;
      if (fundraisingIdea) {
        this.updateForm(fundraisingIdea);
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
    const fundraisingIdea = this.fundraisingIdeaFormService.getFundraisingIdea(this.editForm);
    if (fundraisingIdea.id !== null) {
      this.subscribeToSaveResponse(this.fundraisingIdeaService.update(fundraisingIdea));
    } else {
      this.subscribeToSaveResponse(this.fundraisingIdeaService.create(fundraisingIdea));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFundraisingIdea>>): void {
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

  protected updateForm(fundraisingIdea: IFundraisingIdea): void {
    this.fundraisingIdea = fundraisingIdea;
    this.fundraisingIdeaFormService.resetForm(this.editForm, fundraisingIdea);

    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      fundraisingIdea.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityProfileService
      .query()
      .pipe(map((res: HttpResponse<ICharityProfile[]>) => res.body ?? []))
      .pipe(
        map((charityProfiles: ICharityProfile[]) =>
          this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
            charityProfiles,
            this.fundraisingIdea?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
