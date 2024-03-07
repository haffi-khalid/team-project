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
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

@Component({
  selector: 'jhi-fundraising-idea-update',
  templateUrl: './fundraising-idea-update.component.html',
})
export class FundraisingIdeaUpdateComponent implements OnInit {
  isSaving = false;
  fundraisingIdea: IFundraisingIdea | null = null;
  locationCategoryValues = Object.keys(LocationCategory);

  charityAdminsSharedCollection: ICharityAdmin[] = [];

  editForm: FundraisingIdeaFormGroup = this.fundraisingIdeaFormService.createFundraisingIdeaFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fundraisingIdeaService: FundraisingIdeaService,
    protected fundraisingIdeaFormService: FundraisingIdeaFormService,
    protected charityAdminService: CharityAdminService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityAdmin = (o1: ICharityAdmin | null, o2: ICharityAdmin | null): boolean =>
    this.charityAdminService.compareCharityAdmin(o1, o2);

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

    this.charityAdminsSharedCollection = this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
      this.charityAdminsSharedCollection,
      fundraisingIdea.charityAdmin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityAdminService
      .query()
      .pipe(map((res: HttpResponse<ICharityAdmin[]>) => res.body ?? []))
      .pipe(
        map((charityAdmins: ICharityAdmin[]) =>
          this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(charityAdmins, this.fundraisingIdea?.charityAdmin)
        )
      )
      .subscribe((charityAdmins: ICharityAdmin[]) => (this.charityAdminsSharedCollection = charityAdmins));
  }
}
