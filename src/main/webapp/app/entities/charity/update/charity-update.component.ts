import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CharityFormService, CharityFormGroup } from './charity-form.service';
import { ICharity } from '../charity.model';
import { CharityService } from '../service/charity.service';

@Component({
  selector: 'jhi-charity-update',
  templateUrl: './charity-update.component.html',
})
export class CharityUpdateComponent implements OnInit {
  isSaving = false;
  charity: ICharity | null = null;

  editForm: CharityFormGroup = this.charityFormService.createCharityFormGroup();

  constructor(
    protected charityService: CharityService,
    protected charityFormService: CharityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charity }) => {
      this.charity = charity;
      if (charity) {
        this.updateForm(charity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const charity = this.charityFormService.getCharity(this.editForm);
    if (charity.id !== null) {
      this.subscribeToSaveResponse(this.charityService.update(charity));
    } else {
      this.subscribeToSaveResponse(this.charityService.create(charity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharity>>): void {
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

  protected updateForm(charity: ICharity): void {
    this.charity = charity;
    this.charityFormService.resetForm(this.editForm, charity);
  }
}
