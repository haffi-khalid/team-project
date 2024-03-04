import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityAdminFormService, CharityAdminFormGroup } from './charity-admin-form.service';
import { ICharityAdmin } from '../charity-admin.model';
import { CharityAdminService } from '../service/charity-admin.service';
import { IBudgetPlanner } from 'app/entities/budget-planner/budget-planner.model';
import { BudgetPlannerService } from 'app/entities/budget-planner/service/budget-planner.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-charity-admin-update',
  templateUrl: './charity-admin-update.component.html',
})
export class CharityAdminUpdateComponent implements OnInit {
  isSaving = false;
  charityAdmin: ICharityAdmin | null = null;

  budgetPlannersCollection: IBudgetPlanner[] = [];
  charityProfilesCollection: ICharityProfile[] = [];

  editForm: CharityAdminFormGroup = this.charityAdminFormService.createCharityAdminFormGroup();

  constructor(
    protected charityAdminService: CharityAdminService,
    protected charityAdminFormService: CharityAdminFormService,
    protected budgetPlannerService: BudgetPlannerService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareBudgetPlanner = (o1: IBudgetPlanner | null, o2: IBudgetPlanner | null): boolean =>
    this.budgetPlannerService.compareBudgetPlanner(o1, o2);

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityAdmin }) => {
      this.charityAdmin = charityAdmin;
      if (charityAdmin) {
        this.updateForm(charityAdmin);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charityAdmin = this.charityAdminFormService.getCharityAdmin(this.editForm);
    if (charityAdmin.id !== null) {
      this.subscribeToSaveResponse(this.charityAdminService.update(charityAdmin));
    } else {
      this.subscribeToSaveResponse(this.charityAdminService.create(charityAdmin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityAdmin>>): void {
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

  protected updateForm(charityAdmin: ICharityAdmin): void {
    this.charityAdmin = charityAdmin;
    this.charityAdminFormService.resetForm(this.editForm, charityAdmin);

    this.budgetPlannersCollection = this.budgetPlannerService.addBudgetPlannerToCollectionIfMissing<IBudgetPlanner>(
      this.budgetPlannersCollection,
      charityAdmin.budgetPlanner
    );
    this.charityProfilesCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesCollection,
      charityAdmin.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.budgetPlannerService
      .query({ filter: 'charityadmin-is-null' })
      .pipe(map((res: HttpResponse<IBudgetPlanner[]>) => res.body ?? []))
      .pipe(
        map((budgetPlanners: IBudgetPlanner[]) =>
          this.budgetPlannerService.addBudgetPlannerToCollectionIfMissing<IBudgetPlanner>(budgetPlanners, this.charityAdmin?.budgetPlanner)
        )
      )
      .subscribe((budgetPlanners: IBudgetPlanner[]) => (this.budgetPlannersCollection = budgetPlanners));

    this.charityProfileService
      .query({ filter: 'charityadmin-is-null' })
      .pipe(map((res: HttpResponse<ICharityProfile[]>) => res.body ?? []))
      .pipe(
        map((charityProfiles: ICharityProfile[]) =>
          this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
            charityProfiles,
            this.charityAdmin?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesCollection = charityProfiles));
  }
}
