import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ApprovedVolunteersFormService, ApprovedVolunteersFormGroup } from './approved-volunteers-form.service';
import { IApprovedVolunteers } from '../approved-volunteers.model';
import { ApprovedVolunteersService } from '../service/approved-volunteers.service';
import { ICharityHubUser } from 'app/entities/charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from 'app/entities/charity-hub-user/service/charity-hub-user.service';
import { ICharityAdmin } from 'app/entities/charity-admin/charity-admin.model';
import { CharityAdminService } from 'app/entities/charity-admin/service/charity-admin.service';

@Component({
  selector: 'jhi-approved-volunteers-update',
  templateUrl: './approved-volunteers-update.component.html',
})
export class ApprovedVolunteersUpdateComponent implements OnInit {
  isSaving = false;
  approvedVolunteers: IApprovedVolunteers | null = null;

  charityHubUsersSharedCollection: ICharityHubUser[] = [];
  charityAdminsSharedCollection: ICharityAdmin[] = [];

  editForm: ApprovedVolunteersFormGroup = this.approvedVolunteersFormService.createApprovedVolunteersFormGroup();

  constructor(
    protected approvedVolunteersService: ApprovedVolunteersService,
    protected approvedVolunteersFormService: ApprovedVolunteersFormService,
    protected charityHubUserService: CharityHubUserService,
    protected charityAdminService: CharityAdminService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityHubUser = (o1: ICharityHubUser | null, o2: ICharityHubUser | null): boolean =>
    this.charityHubUserService.compareCharityHubUser(o1, o2);

  compareCharityAdmin = (o1: ICharityAdmin | null, o2: ICharityAdmin | null): boolean =>
    this.charityAdminService.compareCharityAdmin(o1, o2);

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

    this.charityHubUsersSharedCollection = this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
      this.charityHubUsersSharedCollection,
      approvedVolunteers.charityHubUser
    );
    this.charityAdminsSharedCollection = this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(
      this.charityAdminsSharedCollection,
      approvedVolunteers.charityAdmin
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityHubUserService
      .query()
      .pipe(map((res: HttpResponse<ICharityHubUser[]>) => res.body ?? []))
      .pipe(
        map((charityHubUsers: ICharityHubUser[]) =>
          this.charityHubUserService.addCharityHubUserToCollectionIfMissing<ICharityHubUser>(
            charityHubUsers,
            this.approvedVolunteers?.charityHubUser
          )
        )
      )
      .subscribe((charityHubUsers: ICharityHubUser[]) => (this.charityHubUsersSharedCollection = charityHubUsers));

    this.charityAdminService
      .query()
      .pipe(map((res: HttpResponse<ICharityAdmin[]>) => res.body ?? []))
      .pipe(
        map((charityAdmins: ICharityAdmin[]) =>
          this.charityAdminService.addCharityAdminToCollectionIfMissing<ICharityAdmin>(charityAdmins, this.approvedVolunteers?.charityAdmin)
        )
      )
      .subscribe((charityAdmins: ICharityAdmin[]) => (this.charityAdminsSharedCollection = charityAdmins));
  }
}
