import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VolunteerApplicationsFormService, VolunteerApplicationsFormGroup } from './volunteer-applications-form.service';
import { IVolunteerApplications } from '../volunteer-applications.model';
import { VolunteerApplicationsService } from '../service/volunteer-applications.service';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { IVacancies } from 'app/entities/vacancies/vacancies.model';
import { VacanciesService } from 'app/entities/vacancies/service/vacancies.service';
import { ApplicationCategory } from 'app/entities/enumerations/application-category.model';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-volunteer-applications-update',
  templateUrl: './volunteer-applications-update.component.html',
})
export class VolunteerApplicationsUpdateComponent implements OnInit {
  isSaving = false;
  volunteerApplications: IVolunteerApplications | null = null;
  applicationCategoryValues = Object.keys(ApplicationCategory);

  charityAdminsSharedCollection: ICharityAdmin[] = [];
  charityHubUsersSharedCollection: ICharityHubUser[] = [];
  vacanciesSharedCollection: IVacancies[] = [];

  editForm: VolunteerApplicationsFormGroup = this.volunteerApplicationsFormService.createVolunteerApplicationsFormGroup();

  constructor(
    protected volunteerApplicationsService: VolunteerApplicationsService,
    protected volunteerApplicationsFormService: VolunteerApplicationsFormService,
    protected charityAdminService: CharityAdminService,
    protected charityHubUserService: CharityHubUserService,
    protected vacanciesService: VacanciesService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {}

  compareCharityAdmin = (o1: ICharityAdmin | null, o2: ICharityAdmin | null): boolean =>
    this.charityAdminService.compareCharityAdmin(o1, o2);

  compareCharityHubUser = (o1: ICharityHubUser | null, o2: ICharityHubUser | null): boolean =>
    this.charityHubUserService.compareCharityHubUser(o1, o2);

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

    this.charityAdminsSharedCollection = this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
      this.charityAdminsSharedCollection,
      volunteerApplications.charityAdmin
    );
    this.charityHubUsersSharedCollection = this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
      this.charityHubUsersSharedCollection,
      volunteerApplications.charityHubUser
    );
    this.vacanciesSharedCollection = this.vacanciesService.addVacanciesToCollectionIfMissing<IVacancies>(
      this.vacanciesSharedCollection,
      volunteerApplications.vacancies
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityAdminService
      .query()
      .pipe(map((res: HttpResponse<ICharityAdmin[]>) => res.body ?? []))
      .pipe(
        map((charityAdmins: ICharityAdmin[]) =>
          this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
            charityAdmins,
            this.volunteerApplications?.charityAdmin
          )
        )
      )
      .subscribe((charityAdmins: ICharityAdmin[]) => (this.charityAdminsSharedCollection = charityAdmins));

    this.charityHubUserService
      .query()
      .pipe(map((res: HttpResponse<ICharityHubUser[]>) => res.body ?? []))
      .pipe(
        map((charityHubUsers: ICharityHubUser[]) =>
          this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
            charityHubUsers,
            this.volunteerApplications?.charityHubUser
          )
        )
      )
      .subscribe((charityHubUsers: ICharityHubUser[]) => (this.charityHubUsersSharedCollection = charityHubUsers));

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
