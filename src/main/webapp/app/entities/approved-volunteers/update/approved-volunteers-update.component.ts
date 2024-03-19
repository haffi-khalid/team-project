import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApprovedVolunteersFormService, ApprovedVolunteersFormGroup } from './approved-volunteers-form.service';
import { IApprovedVolunteers } from '../approved-volunteers.model';
import { ApprovedVolunteersService } from '../service/approved-volunteers.service';
import { IVolunteerApplications } from 'app/entities/volunteer-applications/volunteer-applications.model';
import { VolunteerApplicationsService } from 'app/entities/volunteer-applications/service/volunteer-applications.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-approved-volunteers-update',
  templateUrl: './approved-volunteers-update.component.html',
})
export class ApprovedVolunteersUpdateComponent implements OnInit {
  isSaving = false;
  approvedVolunteers: IApprovedVolunteers | null = null;

  volunteerApplicationsCollection: IVolunteerApplications[] = [];
  userPagesSharedCollection: IUserPage[] = [];
  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: ApprovedVolunteersFormGroup = this.approvedVolunteersFormService.createApprovedVolunteersFormGroup();

  constructor(
    protected approvedVolunteersService: ApprovedVolunteersService,
    protected approvedVolunteersFormService: ApprovedVolunteersFormService,
    protected volunteerApplicationsService: VolunteerApplicationsService,
    protected userPageService: UserPageService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVolunteerApplications = (o1: IVolunteerApplications | null, o2: IVolunteerApplications | null): boolean =>
    this.volunteerApplicationsService.compareVolunteerApplications(o1, o2);

  compareUserPage = (o1: IUserPage | null, o2: IUserPage | null): boolean => this.userPageService.compareUserPage(o1, o2);

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ approvedVolunteers }) => {
      this.approvedVolunteers = approvedVolunteers;
      if (approvedVolunteers) {
        this.updateForm(approvedVolunteers);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const approvedVolunteers = this.approvedVolunteersFormService.getApprovedVolunteers(this.editForm);
    if (approvedVolunteers.id !== null) {
      this.subscribeToSaveResponse(this.approvedVolunteersService.update(approvedVolunteers));
    } else {
      this.subscribeToSaveResponse(this.approvedVolunteersService.create(approvedVolunteers));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApprovedVolunteers>>): void {
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

  protected updateForm(approvedVolunteers: IApprovedVolunteers): void {
    this.approvedVolunteers = approvedVolunteers;
    this.approvedVolunteersFormService.resetForm(this.editForm, approvedVolunteers);

    this.volunteerApplicationsCollection =
      this.volunteerApplicationsService.addVolunteerApplicationsToCollectionIfMissing<IVolunteerApplications>(
        this.volunteerApplicationsCollection,
        approvedVolunteers.volunteerApplications
      );
    this.userPagesSharedCollection = this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(
      this.userPagesSharedCollection,
      approvedVolunteers.userPage
    );
    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      approvedVolunteers.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.volunteerApplicationsService
      .query({ filter: 'approvedvolunteers-is-null' })
      .pipe(map((res: HttpResponse<IVolunteerApplications[]>) => res.body ?? []))
      .pipe(
        map((volunteerApplications: IVolunteerApplications[]) =>
          this.volunteerApplicationsService.addVolunteerApplicationsToCollectionIfMissing<IVolunteerApplications>(
            volunteerApplications,
            this.approvedVolunteers?.volunteerApplications
          )
        )
      )
      .subscribe((volunteerApplications: IVolunteerApplications[]) => (this.volunteerApplicationsCollection = volunteerApplications));

    this.userPageService
      .query()
      .pipe(map((res: HttpResponse<IUserPage[]>) => res.body ?? []))
      .pipe(
        map((userPages: IUserPage[]) =>
          this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(userPages, this.approvedVolunteers?.userPage)
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
            this.approvedVolunteers?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
