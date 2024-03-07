import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityEventFormService, CharityEventFormGroup } from './charity-event-form.service';
import { ICharityEvent } from '../charity-event.model';
import { CharityEventService } from '../service/charity-event.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-charity-event-update',
  templateUrl: './charity-event-update.component.html',
})
export class CharityEventUpdateComponent implements OnInit {
  isSaving = false;
  charityEvent: ICharityEvent | null = null;

  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: CharityEventFormGroup = this.charityEventFormService.createCharityEventFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected charityEventService: CharityEventService,
    protected charityEventFormService: CharityEventFormService,
    protected charityProfileService: CharityProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityEvent }) => {
      this.charityEvent = charityEvent;
      if (charityEvent) {
        this.updateForm(charityEvent);
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
    const charityEvent = this.charityEventFormService.getCharityEvent(this.editForm);
    if (charityEvent.id !== null) {
      this.subscribeToSaveResponse(this.charityEventService.update(charityEvent));
    } else {
      this.subscribeToSaveResponse(this.charityEventService.create(charityEvent));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityEvent>>): void {
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

  protected updateForm(charityEvent: ICharityEvent): void {
    this.charityEvent = charityEvent;
    this.charityEventFormService.resetForm(this.editForm, charityEvent);

    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      charityEvent.charityProfile
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
            this.charityEvent?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
