import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CharityHubUserFormService, CharityHubUserFormGroup } from './charity-hub-user-form.service';
import { ICharityHubUser } from '../charity-hub-user.model';
import { CharityHubUserService } from '../service/charity-hub-user.service';

@Component({
  selector: 'jhi-charity-hub-user-update',
  templateUrl: './charity-hub-user-update.component.html',
})
export class CharityHubUserUpdateComponent implements OnInit {
  isSaving = false;
  charityHubUser: ICharityHubUser | null = null;

  editForm: CharityHubUserFormGroup = this.charityHubUserFormService.createCharityHubUserFormGroup();

  constructor(
    protected charityHubUserService: CharityHubUserService,
    protected charityHubUserFormService: CharityHubUserFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityHubUser }) => {
      this.charityHubUser = charityHubUser;
      if (charityHubUser) {
        this.updateForm(charityHubUser);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charityHubUser = this.charityHubUserFormService.getCharityHubUser(this.editForm);
    if (charityHubUser.id !== null) {
      this.subscribeToSaveResponse(this.charityHubUserService.update(charityHubUser));
    } else {
      this.subscribeToSaveResponse(this.charityHubUserService.create(charityHubUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityHubUser>>): void {
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

  protected updateForm(charityHubUser: ICharityHubUser): void {
    this.charityHubUser = charityHubUser;
    this.charityHubUserFormService.resetForm(this.editForm, charityHubUser);
  }
}
