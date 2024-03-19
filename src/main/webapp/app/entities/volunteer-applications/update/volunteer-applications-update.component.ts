import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VolunteerApplicationsFormService, VolunteerApplicationsFormGroup } from './volunteer-applications-form.service';
import { IVolunteerApplications } from '../volunteer-applications.model';
import { VolunteerApplicationsService } from '../service/volunteer-applications.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { VacanciesService } from 'app/entities/vacancies/service/vacancies.service';
import { ApplicationCategory } from 'app/entities/enumerations/application-category.model';

@Component({
  selector: 'jhi-volunteer-applications-update',
  templateUrl: './volunteer-applications-update.component.html',
})
export class VolunteerApplicationsUpdateComponent implements OnInit {
  isSaving = false;
  volunteerApplications: IVolunteerApplications | null = null;
  applicationCategoryValues = Object.keys(ApplicationCategory);

  charityProfilesSharedCollection: ICharityProfile[] = [];
  userPagesSharedCollection: IUserPage[] = [];
  vacanciesSharedCollection: IVacancies[] = [];

  editForm: VolunteerApplicationsFormGroup = this.volunteerApplicationsFormService.createVolunteerApplicationsFormGroup();

  constructor(
    protected volunteerApplicationsService: VolunteerApplicationsService,
    protected volunteerApplicationsFormService: VolunteerApplicationsFormService,
    protected charityProfileService: CharityProfileService,
    protected userPageService: UserPageService,
    protected vacanciesService: VacanciesService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  compareUserPage = (o1: IUserPage | null, o2: IUserPage | null): boolean => this.userPageService.compareUserPage(o1, o2);

  compareVacancies = (o1: IVacancies | null, o2: IVacancies | null): boolean => this.vacanciesService.compareVacancies(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ volunteerApplications }) => {
      this.volunteerApplications = volunteerApplications;
      if (volunteerApplications) {
        this.updateForm(volunteerApplications);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const volunteerApplications = this.volunteerApplicationsFormService.getVolunteerApplications(this.editForm);
    if (volunteerApplications.id !== null) {
      this.subscribeToSaveResponse(this.volunteerApplicationsService.update(volunteerApplications));
    } else {
      this.subscribeToSaveResponse(this.volunteerApplicationsService.create(volunteerApplications));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVolunteerApplications>>): void {
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

  protected updateForm(volunteerApplications: IVolunteerApplications): void {
    this.volunteerApplications = volunteerApplications;
    this.volunteerApplicationsFormService.resetForm(this.editForm, volunteerApplications);

    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      volunteerApplications.charityProfile
    );
    this.userPagesSharedCollection = this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(
      this.userPagesSharedCollection,
      volunteerApplications.userPage
    );
    this.vacanciesSharedCollection = this.vacanciesService.addVacanciesToCollectionIfMissing<IVacancies>(
      this.vacanciesSharedCollection,
      volunteerApplications.vacancies
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
            this.volunteerApplications?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));

    this.userPageService
      .query()
      .pipe(map((res: HttpResponse<IUserPage[]>) => res.body ?? []))
      .pipe(
        map((userPages: IUserPage[]) =>
          this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(userPages, this.volunteerApplications?.userPage)
        )
      )
      .subscribe((userPages: IUserPage[]) => (this.userPagesSharedCollection = userPages));

    this.vacanciesService
      .query()
      .pipe(map((res: HttpResponse<IVacancies[]>) => res.body ?? []))
      .pipe(
        map((vacancies: IVacancies[]) =>
          this.vacanciesService.addVacanciesToCollectionIfMissing<IVacancies>(vacancies, this.volunteerApplications?.vacancies)
        )
      )
      .subscribe((vacancies: IVacancies[]) => (this.vacanciesSharedCollection = vacancies));
  }
}
