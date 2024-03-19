import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CharityAdminFormService, CharityAdminFormGroup } from './charity-admin-form.service';
import { ICharityAdmin } from '../charity-admin.model';
import { CharityAdminService } from '../service/charity-admin.service';

@Component({
  selector: 'jhi-charity-admin-update',
  templateUrl: './charity-admin-update.component.html',
})
export class CharityAdminUpdateComponent implements OnInit {
  isSaving = false;
  charityAdmin: ICharityAdmin | null = null;

  editForm: CharityAdminFormGroup = this.charityAdminFormService.createCharityAdminFormGroup();

  constructor(
    protected charityAdminService: CharityAdminService,
    protected charityAdminFormService: CharityAdminFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityAdmin }) => {
      this.charityAdmin = charityAdmin;
      if (charityAdmin) {
        this.updateForm(charityAdmin);
      }
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
  }
}
