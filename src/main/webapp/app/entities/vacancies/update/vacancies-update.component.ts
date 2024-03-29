import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VacanciesFormService, VacanciesFormGroup } from './vacancies-form.service';
import { IVacancies } from '../vacancies.model';
import { VacanciesService } from '../service/vacancies.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { LocationCategory } from 'app/entities/enumerations/location-category.model';

@Component({
  selector: 'jhi-vacancies-update',
  templateUrl: './vacancies-update.component.html',
})
export class VacanciesUpdateComponent implements OnInit {
  isSaving = false;
  vacancies: IVacancies | null = null;
  locationCategoryValues = Object.keys(LocationCategory);

  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: VacanciesFormGroup = this.vacanciesFormService.createVacanciesFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected vacanciesService: VacanciesService,
    protected vacanciesFormService: VacanciesFormService,
    protected charityProfileService: CharityProfileService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacancies }) => {
      this.vacancies = vacancies;
      if (vacancies) {
        this.updateForm(vacancies);
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
    const vacancies = this.vacanciesFormService.getVacancies(this.editForm);
    if (vacancies.id !== null) {
      this.subscribeToSaveResponse(this.vacanciesService.update(vacancies));
    } else {
      this.subscribeToSaveResponse(this.vacanciesService.create(vacancies));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVacancies>>): void {
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

  protected updateForm(vacancies: IVacancies): void {
    this.vacancies = vacancies;
    this.vacanciesFormService.resetForm(this.editForm, vacancies);

    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      vacancies.charityProfile
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
            this.vacancies?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
