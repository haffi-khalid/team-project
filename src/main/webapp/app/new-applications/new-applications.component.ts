import { Component, OnInit } from '@angular/core';
import { IVolunteerApplications } from '../entities/volunteer-applications/volunteer-applications.model';
import { ApplicationCategory } from '../entities/enumerations/application-category.model';
import { ICharityAdmin } from '../entities/charity-admin/charity-admin.model';
import { ICharityHubUser } from '../entities/charity-hub-user/charity-hub-user.model';
import { IVacancies } from '../entities/vacancies/vacancies.model';
import {
  VolunteerApplicationsFormGroup,
  VolunteerApplicationsFormService,
} from '../entities/volunteer-applications/update/volunteer-applications-form.service';
import { VolunteerApplicationsService } from '../entities/volunteer-applications/service/volunteer-applications.service';
import { CharityAdminService } from '../entities/charity-admin/service/charity-admin.service';
import { CharityHubUserService } from '../entities/charity-hub-user/service/charity-hub-user.service';
import { VacanciesService } from '../entities/vacancies/service/vacancies.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../core/auth/account.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize, map } from 'rxjs/operators';
import { DataUtils } from '../core/util/data-util.service';
import { LoginPopUpCheckComponent } from '../login-pop-up-check/login-pop-up-check.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-new-applications',
  templateUrl: './new-applications.component.html',
  styleUrls: ['./new-applications.component.scss'],
})
export class NewApplicationsComponent implements OnInit {
  isSaving = false;
  volunteerApplications: IVolunteerApplications | null = null;
  vacancy: IVacancies | null = null;

  charityAdminsSharedCollection: ICharityAdmin[] = [];
  charityHubUsersSharedCollection: ICharityHubUser[] = [];
  charityHubUser: ICharityHubUser | null = null;
  charityAdmin: ICharityAdmin | null = null;
  vacanciesSharedCollection: IVacancies[] = [];
  applicationCategoryValues = Object.keys(ApplicationCategory);

  editForm: VolunteerApplicationsFormGroup = this.volunteerApplicationsFormService.createVolunteerApplicationsFormGroup();

  constructor(
    protected volunteerApplicationsService: VolunteerApplicationsService,
    protected volunteerApplicationsFormService: VolunteerApplicationsFormService,
    protected charityAdminService: CharityAdminService,
    protected charityHubUserService: CharityHubUserService,
    protected vacanciesService: VacanciesService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {}

  compareCharityAdmin = (o1: ICharityAdmin | null, o2: ICharityAdmin | null): boolean =>
    this.charityAdminService.compareCharityAdmin(o1, o2);

  compareCharityHubUser = (o1: ICharityHubUser | null, o2: ICharityHubUser | null): boolean =>
    this.charityHubUserService.compareCharityHubUser(o1, o2);

  compareVacancies = (o1: IVacancies | null, o2: IVacancies | null): boolean => this.vacanciesService.compareVacancies(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vacancy }) => {
      this.vacancy = vacancy;
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  openFile(base64String: string, contentType: string): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  save(): void {
    this.isSaving = true;
    const volunteerApplications = this.volunteerApplicationsFormService.getVolunteerApplications(this.editForm);
    volunteerApplications.volunteerStatus = ApplicationCategory.PENDING;
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
    // this.previousState();
    const modalRef = this.modalService.open(LoginPopUpCheckComponent, { size: 'xl' });
    modalRef.componentInstance.toggled = true;
    modalRef.componentInstance.vacancies = this.vacancy;
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
      .findByCharityProfile(this.vacancy?.charityProfile?.id)
      .subscribe((res: HttpResponse<ICharityAdmin>) => (this.charityAdmin = res.body));
    // this.charityAdminService
    //   .query()
    //   .pipe(map((res: HttpResponse<ICharityAdmin[]>) => res.body ?? []))
    //   .pipe(
    //     map((charityAdmins: ICharityAdmin[]) =>
    //       this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
    //         charityAdmins,
    //         this.volunteerApplications?.charityAdmin
    //       )
    //     )
    //   )
    //   .subscribe((charityAdmins: ICharityAdmin[]) => (this.charityAdminsSharedCollection = charityAdmins));

    // this.charityHubUserService
    //   .query()
    //   .pipe(map((res: HttpResponse<ICharityHubUser[]>) => res.body ?? []))
    //   .pipe(
    //     map((charityHubUsers: ICharityHubUser[]) =>
    //       this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
    //         charityHubUsers,
    //         this.volunteerApplications?.charityHubUser
    //       )
    //     )
    //   )
    //   .subscribe((charityHubUsers: ICharityHubUser[]) => (this.charityHubUsersSharedCollection = charityHubUsers));
    this.charityHubUserService.findByUser().subscribe((res: HttpResponse<ICharityHubUser>) => (this.charityHubUser = res.body));

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
