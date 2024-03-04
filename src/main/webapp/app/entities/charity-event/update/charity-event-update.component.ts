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
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';

@Component({
  selector: 'jhi-charity-event-update',
  templateUrl: './charity-event-update.component.html',
})
export class CharityEventUpdateComponent implements OnInit {
  isSaving = false;
  charityEvent: ICharityEvent | null = null;

  charityAdminsSharedCollection: ICharityAdmin[] = [];

  editForm: CharityEventFormGroup = this.charityEventFormService.createCharityEventFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected charityEventService: CharityEventService,
    protected charityEventFormService: CharityEventFormService,
    protected charityAdminService: CharityAdminService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityAdmin = (o1: ICharityAdmin | null, o2: ICharityAdmin | null): boolean =>
    this.charityAdminService.compareCharityAdmin(o1, o2);

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

    this.charityAdminsSharedCollection = this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
      this.charityAdminsSharedCollection,
      charityEvent.charityAdmin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityAdminService
      .query()
      .pipe(map((res: HttpResponse<ICharityAdmin[]>) => res.body ?? []))
      .pipe(
        map((charityAdmins: ICharityAdmin[]) =>
          this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(charityAdmins, this.charityEvent?.charityAdmin)
        )
      )
      .subscribe((charityAdmins: ICharityAdmin[]) => (this.charityAdminsSharedCollection = charityAdmins));
  }
}
